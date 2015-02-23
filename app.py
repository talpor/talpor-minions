import os
import subprocess

from flask import Flask, render_template, send_file
from flask.ext.pymongo import PyMongo

app = Flask(__name__)

mongo = PyMongo(app)


def run_game(agent1_name, agent2_name):
    command = 'node {} {} {}'.format(
        os.path.join('game', 'main.js'), agent1_name, agent2_name
    )
    try:
        return subprocess.check_output(command, shell=True)
    except subprocess.CallProcessError:
        return False


@app.route('/')
def home():
    """Returns main battle page."""
    fights_today = [{
            'p1': 'max',
            'p2': 'volrath',
            'winner': 'max',
            'id': 1
        },
        {
            'p1': 'ctaloc',
            'p2': 'i7',
            'winner': 'i7',
            'id': 2
        }]
    top_armies = [{
            'commander': 'max',
            'flops': 1245
        },
        {
            'commander': 'volrath',
            'flops': 1123
        }]
    return render_template('home.html',
                           fights_today=fights_today,
                           top_armies=top_armies)


@app.route('/play/<p1>/<p2>')
def play(p1, p2):
    """Play the game."""
    states_file = run_game('{}.js'.format(p1), '{}.js'.format(p2))
    return send_file(states_file, mimetype='application/json')


if __name__ == '__main__':
    app.run()
