import os
import subprocess

from flask import Flask, render_template, send_file


app = Flask(__name__)


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
    return render_template('home.html')


@app.route('/play')
def play():
    """Play the game."""
    states_file = run_game('agent1', 'agent2')
    return send_file(states_file, mimetype='json')


if __name__ == '__main__':
    app.run()
