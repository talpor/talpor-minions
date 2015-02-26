import os, shutil, subprocess
from datetime import datetime

from flask import (
    Flask, flash, render_template, send_file, request, redirect, url_for
)
from flask.ext.pymongo import PyMongo

from github3 import gist as gh_gist
from pytz import utc
from werkzeug import secure_filename


# Application
# -----------------------------------------------------------------------------
app = Flask(__name__)
app.config.from_object('config')

mongo = PyMongo(app)


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


# Helpers
# -----------------------------------------------------------------------------

def strptime(time_str):
    """Convert an ISO 8601 formatted string in UTC into a timezone-aware
    datetime object.
    """
    dt = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%SZ')
    return dt.replace(tzinfo=utc)


def run_game(agent1_name, agent2_name):
    command = 'node {} {} {}'.format(
        os.path.join(app.config['GAME_FOLDER'], 'main.js'),
        agent1_name, agent2_name
    )
    try:
        return subprocess.check_output(
            command, shell=True, env={'NODE_PATH': app.config['GAME_FOLDER']}
        )
    except subprocess.CallProcessError:
        return False


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
    agent = mongo.db.agents.find_one({'id': gist_id})
    if agent and gist.updated_at <= strptime(agent['updated_at']):
        return False

    gist_json = gist.to_json()
    mongo.db.agents.update(
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



# Views
# -----------------------------------------------------------------------------

@app.route('/')
def home():
    """Returns main battle page."""
    armies = {}
    for agent in os.listdir(app.config['UPLOAD_FOLDER']):
        if agent.startswith('gist::'):
            agent_obj = mongo.db.agents.find_one(
                {'id': agent.replace('gist::', '')}
            )
            if not agent_obj:
                continue
            armies[agent] = '{}/{}'.format(agent_obj['owner']['login'],
                                           agent_obj['description'])
        elif agent.endswith('.js'):
            agent = agent.replace('.js', '')
            armies[agent] = agent

    return render_template('home.html', armies=armies)


@app.route('/new-agent', methods=['POST'])
def new_agent():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    if request.form['gist-id']:
        upsert_gist(request.form['gist-id'])
    return redirect(url_for('home'))


@app.route('/play/<p1>/<p2>')
def play(p1, p2):
    """Play the game.

    If any player is a gist id, re-fetch it and compare the `updated_at` time
    between our db and gist. Update our replica if necessary.
    """
    if p1.startswith('gist::'):
        upsert_gist(p1.replace('gist::', ''))
    if p2.startswith('gist::'):
        upsert_gist(p2.replace('gist::', ''))

    states_file = run_game(p1, p2)
    return send_file(states_file, mimetype='application/json')
