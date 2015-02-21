import os
import subprocess

from flask import Flask, render_template, send_file


app = Flask(__name__)


def run_game(agent1_file_path, agent2_file_path):
    command = 'node {} {} {}'.format(
        os.path.join('game', 'main.js'), agent1_file_path, agent2_file_path
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
    states_file = run_game(
        os.path.join('game', 'agent1.js'), os.path.join('game', 'agent2.js')
    )
    return send_file(states_file, mimetype='json')


if __name__ == '__main__':
    app.run()
