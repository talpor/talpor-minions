import os

root = os.path.split(os.path.dirname(os.path.realpath(__file__)))[0]

workers = 2
bind = '0.0.0.0:5001'
pidfile = os.path.join(root, 'server', 'gunicorn.pid')
debug = True
loglevel = 'warning'
errorlog = os.path.join(root, 'server', 'logs', 'gunicorn.log')
daemon = False
