import os

_basedir = os.path.abspath(os.path.dirname(__file__))

def num_cpus():
    if not hasattr(os, "sysconf"):
        raise RuntimeError("No sysconf detected.")
    return os.sysconf("SC_NPROCESSORS_ONLN")


DEBUG = True

ADMINS = frozenset(
    ['dbarreto@talpor.com', 'mreyes@talpor.com', 'mrondon@talpor.com']
)
SECRET_KEY = 'A0Zr98j/3yXsdr R~XHXFG!jmN]ASSR/,?RX'

GAME_FOLDER = os.path.join(_basedir, 'game')
AGENTS_FOLDER = os.path.join(GAME_FOLDER, 'agents')
BATTLES_FOLDER = os.path.join(GAME_FOLDER, 'battles')

MONGO_DBNAME = 'vikings'

THREADS_PER_PAGE = num_cpus() * 2
SEND_FILE_MAX_AGE_DEFAULT = 0
