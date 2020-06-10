# UT-TOR-DATA-PT-01-2020-U-C Group Project 2
# Flask server

import flask as f
from flask import Flask, request, jsonify

import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine, event, MetaData, Table

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


#################################################
# Database Setup
#################################################

# Create engine to access the database
engine = create_engine("sqlite:///../data/CanadaTop100.sqlite")

# Turn on PRAGMA foreign_keys to enforce foregn key constraints (it is disabled by default in SQLite)
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# Create session registry
Session = scoped_session( sessionmaker(bind=engine) )

@app.teardown_request
def remove_session(exc=None):
    Session.remove()

# Reflect an existing database into a new model
AutomapBase = automap_base()

# Reflect the tables
AutomapBase.prepare(engine, reflect=True)

# Save references to each table
Artist = AutomapBase.classes.Artist
Chart = AutomapBase.classes.Chart
Performed_by = AutomapBase.classes.Performed_by
Song = AutomapBase.classes.Song

# Views
meta = MetaData()
SongEvolution = Table('SongEvolution', meta, autoload=True, autoload_with=engine)

#################################################
# Flask Routes
#################################################

# ---------------------
# Handle 404 situations
# ---------------------

@app.errorhandler(404)
def page_not_found(error):
    return jsonify(error=str(error)), 404

# -----------------------------------------
# Static parts: imdex.html, js, css, images
# -----------------------------------------

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

# -------------------------
# Dynamic parts: DB queries
# -------------------------

# Query arbitrary song
@app.route('/api/v1.0/song/<int:song_id>')
def get_song(song_id):
    session = Session()
    song = session.query(Song).filter_by(id = song_id).one_or_none()

    if song:
        song_dct = dict(song.__dict__)
        del song_dct['_sa_instance_state']
        song_dct['performers'] = []

        performers = session.query(Performed_by.artist_id).filter_by(song_id = song_id)
        artists = session.query(Artist).filter(Artist.id.in_(performers))
        for a in artists:
            a_dct = dict(a.__dict__)
            del a_dct['_sa_instance_state']
            song_dct['performers'].append(a_dct)

        return jsonify(song_dct)
    else:
        f.abort(404, description=f"Song with id={song_id} was not found in the database")


# Query arbitrary artist
@app.route('/api/v1.0/artist/<int:artist_id>')
def get_atist(artist_id):
    session = Session()
    artist = session.query(Artist).filter_by(id = artist_id).one_or_none()

    if artist:
        artist_dct = dict(artist.__dict__)
        del artist_dct['_sa_instance_state']
        return jsonify(artist_dct)
    else:
        f.abort(404, description=f"Artist with id={artist_id} was not found in the database")


# Get data for "Song Evolution" line chart
# Parameters:
#   position - only show songs that went up to at least this position (e.g. top 25)
#   weeks - only return songs that stayed in the chart for at least this number of weeks
@app.route('/api/v1.0/evolution')
def get_evolution():
    session = Session()
    data = session.query(SongEvolution).order_by(SongEvolution.c.song_id)

    if not data:
        f.abort(404, description=f"Couldn't get data for 'Song Evolution' chart")

    data_lst = []
    song_id = 0
    song_data = {}

    for d in data:
        if d.song_id != song_id: # new song encountered
            # 1. save previous song
            if song_id != 0:
                data_lst.append(song_data)
            # 2. start collecting data for new song
            song_id = d.song_id
            song_data = {
                'id': d.song_id,
                'week': [d.week_number],
                'position': [d.position],
                'score': [d.score]
            }
        else: # Just add data to the current song
            song_data['week'].append(d.week_number)
            song_data['position'].append(d.position)
            song_data['score'].append(d.score)

    # End of processing. Save the last song
    if song_id:
        data_lst.append(song_data)

    return jsonify(data_lst)


# Starting the server

if __name__ == '__main__':
    app.run(debug=True, port=8000)
