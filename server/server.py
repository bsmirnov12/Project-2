# UT-TOR-DATA-PT-01-2020-U-C Group Project 2
# Flask server

import flask as f
from flask import Flask, request, jsonify

import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine, event

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


#################################################
# Database Setup
#################################################

# Turn on PRAGMA foreign_keys to enforce foregn key constraints (it is disabled by default in SQLite)
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Create engine to access the database
engine = create_engine("sqlite:///../data/CanadaTop100.sqlite")

# Reflect an existing database into a new model
AutomapBase = automap_base()

# Reflect the tables
AutomapBase.prepare(engine, reflect=True)

# Save references to each table
Artist = AutomapBase.classes.Artist
Chart = AutomapBase.classes.Chart
Performed_by = AutomapBase.classes.Performed_by
Song = AutomapBase.classes.Song

# Create our session (link) from Python to the DB
Session = scoped_session( sessionmaker(bind=engine) )
session = Session()

@app.teardown_request
def remove_session(ex=None):
    Session.remove()


#################################################
# Flask Routes
#################################################

# Handle 404 situations
@app.errorhandler(404)
def page_not_found(error):
    return jsonify(error=str(error)), 404

# Static parts: imdex.html, js, css, images

@app.route("/")
def home():
    return f.send_from_directory('../', 'index.html')

@app.route('/js/<path:fname>')
def send_js(fname):
    return f.send_from_directory('../js', fname)

@app.route('/css/<path:fname>')
def send_css(fname):
    return f.send_from_directory('../css', fname)

@app.route('/images/<path:fname>')
def send_image(fname):
    return f.send_from_directory('../images', fname)

# Dynamic parts: DB queries

@app.route('/api/v1.0/song/<int:song_id>')
def get_song(song_id):
    song = session.query(Song).filter_by(id = song_id).one_or_none()
    if song:
        song_dct = dict(song.__dict__)
        del song_dct['_sa_instance_state']
        return jsonify(song_dct)
    else:
        f.abort(404, description=f"Song with id={song_id} was not found in the database")


# Starting the server

if __name__ == '__main__':
    app.run(debug=True, port=8000)
