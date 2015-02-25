import os
import subprocess

from flask import Flask, render_template, send_file, request, redirect, url_for
from flask.ext.pymongo import PyMongo

from werkzeug import secure_filename


SECRET_KEY = 'A0Zr98j/3yXsdr R~XHXFG!jmN]ASSR/,?RX'
SEND_FILE_MAX_AGE_DEFAULT = 0

UPLOAD_FOLDER = os.path.join('game', 'agents')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    fights_today = []
    top_armies = []

    agents_dir = os.listdir(os.path.join('game', 'agents'))
    for agent in [f for f in agents_dir]:
        top_armies.append({
            'commander': agent.replace('.js', '')
            })

    return render_template('home.html',
                           fights_today=fights_today,
                           top_armies=top_armies)


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


if __name__ == '__main__':
    app.run(debug=True)
