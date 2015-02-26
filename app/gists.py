import os, shutil
from datetime import datetime

from flask import flash

from github3 import gist as gh_gist
from pytz import utc

import app


def strptime(time_str):
    """Convert an ISO 8601 formatted string in UTC into a timezone-aware
    datetime object.
    """
    dt = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
    return dt.replace(tzinfo=utc)


def upsert_gist(gist_id):
    """Searches for a gist and updates our database, upserting if needed. This
    function will then call `update_gist_dir` to update our `agents` directory
    with the current gist file information.

    Returns a boolean value to whether something was updated or not.
    """
    gist = gh_gist(gist_id)
    if gist is None:
        return

    # Do we already have this gist?
    agent = app.mongo.db.agents.find_one({'id': gist_id})
    if agent and gist.updated_at <= strptime(agent['updated_at']):
        return False

    gist_json = gist.to_json()
    app.mongo.db.agents.update(
        {'id': gist_json['id']},
        {
            'id': gist_json['id'],
            'description': gist_json['description'],
            'html_url': gist_json['html_url'],
            'public': gist_json['public'],
            'created_at': gist_json['created_at'],
            'updated_at': gist_json['updated_at'],
            'owner': {
                'login': gist_json['owner']['login'],
                'avatar_url': gist_json['owner']['avatar_url'],
                'html_url': gist_json['owner']['html_url'],
            },
        },
        upsert=True, multi=False
    )
    update_gist_dir(gist)
    return True


def update_gist_dir(gist):
    if not any([f.filename == 'index.js' for f in gist.iter_files()]):
        flash('Your gist doesn\'t have an index.js.')

    agent_dir = os.path.join(
        app.config['UPLOAD_FOLDER'], 'gist::{}'.format(gist.id)
    )

    shutil.rmtree(agent_dir, ignore_errors=True)
    os.makedirs(agent_dir)

    for f in gist.iter_files():
        if not f.filename.endswith('.js'):
            continue
        with open(os.path.join(agent_dir, f.filename), 'w') as gf:
            gf.write(f.content)
