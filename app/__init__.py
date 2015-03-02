import os, subprocess

from flask import (
    Flask, abort, render_template, send_file, request, redirect, url_for
)
from flask.ext.pymongo import PyMongo

from werkzeug import secure_filename

from .gists import upsert_gist


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


# Views
# -----------------------------------------------------------------------------

@app.route('/')
@app.route('/battle/<battle_id>')
def home(battle_id=None):
    """Returns main battle page.

    When a `battle_id` is given, this function will look up for it in the hard
    drive and will return 404 if it's not found.

    A `battle_id` called via normal http request will just return this same
    home page as if nothing else happened. When called via AJAX, this view will
    return the battle's json states file.
    """
    if battle_id:
        battle_file = os.path.join(
            app.config['BATTLES_FOLDER'], '{}.json.gz'.format(battle_id)
        )
        if not os.path.isfile(battle_file):
            return abort(404)
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':  # is ajax
            return send_file(battle_file, mimetype='application/json')

    armies = {}
    for agent in os.listdir(app.config['AGENTS_FOLDER']):
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
        file.save(os.path.join(app.config['AGENTS_FOLDER'], filename))
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
    return send_file(states_file, mimetype='html/text; charset=utf-8')
