import os
import subprocess

from flask import Flask, render_template, send_file, request, redirect, url_for
from flask.ext.pymongo import PyMongo

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

def run_game(agent1_name, agent2_name):
    command = 'node {} {} {}'.format(
        os.path.join(app.config['GAME_FOLDER'], 'main.js'),
        agent1_name, agent2_name
    )
    try:
        return subprocess.check_output(command, shell=True)
    except subprocess.CallProcessError:
        return False


@app.route('/')
def home():
    """Returns main battle page."""
    return render_template(
        'home.html',
        armies={
            agent.replace('.js', ''): agent.replace('.js', '')
            for agent in os.listdir(
                    os.path.join(app.config['GAME_FOLDER'], 'agents')
            ) if not agent.startswith('gist::')
        }
    )


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return redirect(url_for('home'))


@app.route('/play/<p1>/<p2>')
def play(p1, p2):
    """Play the game."""
    states_file = run_game(p1, p2)
    return send_file(states_file, mimetype='application/json')
