# UT-TOR-DATA-PT-01-2020-U-C Group Project 2
# Flask server

import flask as f
from flask import Flask, request, jsonify

import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine, event, MetaData, Table, func, desc, distinct

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
SkipSongs = Table('SkipSongs', meta, autoload=True, autoload_with=engine)
ArtistRating = Table('ArtistRating', meta, autoload=True, autoload_with=engine)
ArtistWeeks = Table('ArtistWeeks', meta, autoload=True, autoload_with=engine)

#################################################
# Flask Routes
#################################################

# ---------------------
# Handle 400 situations
# ---------------------

@app.errorhandler(404)
def page_not_found(error):
    return jsonify(error=str(error)), 404

@app.errorhandler(400)
def page_not_found(error):
    return jsonify(error=str(error)), 400

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


# Query a list of songs
# Mandatory parameter: ids - a list of comma separated sonf ids
# Returns a list of songs
@app.route('/api/v1.0/songs')
def get_songs():
    try:
        ids_str = request.args.get('ids')
        ids = [int(id) for id in ids_str.split(',')]
    except:
        ids = []

    session = Session()
    songs = session.query(Song).filter(Song.id.in_(ids)).all()

    songs_lst = []
    for song in songs:
        song_dct = dict(song.__dict__)
        del song_dct['_sa_instance_state']
        song_dct['performers'] = []

        performers = session.query(Performed_by.artist_id).filter_by(song_id = song.id)
        artists = session.query(Artist).filter(Artist.id.in_(performers))
        for a in artists:
            a_dct = dict(a.__dict__)
            del a_dct['_sa_instance_state']
            song_dct['performers'].append(a_dct)
        
        songs_lst.append(song_dct)

    return jsonify(songs_lst)


# Query arbitrary artist
@app.route('/api/v1.0/artist/<int:artist_id>')
def get_artist(artist_id):
    session = Session()
    artist = session.query(Artist).filter_by(id = artist_id).one_or_none()

    if artist:
        artist_dct = dict(artist.__dict__)
        del artist_dct['_sa_instance_state']
        return jsonify(artist_dct)
    else:
        f.abort(404, description=f"Artist with id={artist_id} was not found in the database")


# Query a list of artists
# Mandatory parameter: ids - a list of comma separated artist ids
# Returns a list of songs
@app.route('/api/v1.0/artists')
def get_artists():
    try:
        ids_str = request.args.get('ids')
        ids = [int(id) for id in ids_str.split(',')]
    except:
        ids = []

    session = Session()
    artists = session.query(Artist).filter(Artist.id.in_(ids)).all()

    artists_lst = []
    for artist in artists:
        artist_dct = dict(artist.__dict__)
        del artist_dct['_sa_instance_state']
        artists_lst.append(artist_dct)

    return jsonify(artists_lst)

# Get data for "Song Evolution" line chart
# Parameters (all can be combined):
#   years - comma separeted list of years. Include only songs that were in Top 100 during specified years
#   above - include only songs which position number was <=above (above=50 - top half of Top 100, #1 hits and below to #50)
#   below - include only songs which position number was >=below (below=50 - bottom half of Top 100, from #50 to #100)
#   more - include only songs which stayed in Top 100 >=more number of weeks
#   less - include only songs which stayed in Top 100 <=less number of weeks
# usage: /api/v1.0/evolution?years=2020,2019&above=25&more=24 - Top 25 hits from 2019 and 2020 that stayed in Top 100 at leas 24 weeks
# [{
#     "id": 1,
#     "week": [1], 
#     "position": [1], 
#     "score": [100]
# }]
@app.route('/api/v1.0/evolution')
def get_evolution():
    years, above, below, more, less = None, None, None, None, None
    try:
        s = request.args.get('years')
        if s: years = [int(year) for year in s.split(',')]
        s = request.args.get('above')
        if s: above = int(s)
        s = request.args.get('below')
        if s: below = int(s)
        s = request.args.get('more')
        if s: more = int(s)
        s = request.args.get('less')
        if s: less = int(s)
    except: # no filters
        f.abort(400, description=f"Incorrect parameters")
       
    session = Session()
    data = session.query(SongEvolution) #.order_by(SongEvolution.c.song_id)
    # Applying additional filters
    if years:
        song_ids = session.query(distinct(Chart.song_id)).filter(Chart.year.in_(years))
        data = data.filter(SongEvolution.c.song_id.in_(song_ids))
    if above:
        data = data.filter(SongEvolution.c.top_position <= above)
    if below:
        data = data.filter(SongEvolution.c.top_position >= below)
    if more:
        data = data.filter(SongEvolution.c.week_count >= more)
    if less:
        data = data.filter(SongEvolution.c.week_count <= less)

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

    print(len(data_lst))
    return jsonify(data_lst)


# Get data for the scatter plot
# [{
#     "song_id": 1, 
#     "top_position": 1, 
#     "week_count": 1
# }]
@app.route('/api/v1.0/scatter')
def get_scatter():
    session = Session()
    # SELECT song_id,
    #        count(song_id) AS week_count,
    #        min(position) AS top_position
    #   FROM Chart
    #  WHERE song_id NOT IN (
    #            SELECT song_id
    #              FROM SkipSongs
    #        )
    #  GROUP BY song_id;
    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.min(Chart.position).label('top_position'),
            func.count(Chart.song_id).label('week_count')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        group_by(Chart.song_id)

    if not data:
        f.abort(404, description=f"Couldn't get data for the Scatter plot")

    data_lst = []
    for d in data:
        song_dct = {
            'song_id': d.song_id,
            'top_position': d.top_position,
            'week_count': d.week_count
        }
        data_lst.append(song_dct)

    return jsonify(data_lst)


# Get data for "Week count histogram"
# [week_count]
@app.route('/api/v1.0/weekshist')
def get_weekhist():
    session = Session()
    # SELECT song_id,
    #        count(song_id) AS week_count
    #   FROM Chart
    #  WHERE song_id NOT IN (
    #            SELECT song_id
    #              FROM SkipSongs
    #        )
    #  GROUP BY song_id;
    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.count(Chart.song_id).label('week_count')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        group_by(Chart.song_id)

    if not data:
        f.abort(404, description=f"Couldn't get data for the Weeks histogram")

    data_lst = []
    for d in data:
        data_lst.append(d.week_count)

    return jsonify(data_lst)


# Get data for "Top position histogram"
# [top_position]
@app.route('/api/v1.0/tophist')
def get_tophist():
    session = Session()
    # SELECT song_id,
    #        min(position) AS top_position
    #   FROM Chart
    #  WHERE song_id NOT IN (
    #            SELECT id
    #              FROM SkipSongs
    #        )
    #  GROUP BY song_id;
    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.min(Chart.position).label('top_position')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        group_by(Chart.song_id)

    if not data:
        f.abort(404, description=f"Couldn't get data for the Top position histogram")

    data_lst = []
    for d in data:
        data_lst.append(d.top_position)

    return jsonify(data_lst)


# Get data for "Weeks in Top 1 position histogram"
# [week_count]
@app.route('/api/v1.0/weekstop1hist')
def get_weekstophist():
    session = Session()
    # SELECT song_id,
    #        count(song_id) AS week_count
    #   FROM Chart
    #  WHERE song_id NOT IN (
    #            SELECT song_id
    #              FROM SkipSongs
    #        )
    # AND 
    #        position = 1
    #  GROUP BY song_id;
    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.count(Chart.position).label('week_count')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        filter_by(position=1).\
        group_by(Chart.song_id)

    if not data:
        f.abort(404, description=f"Couldn't get data for the Weeks in Top 1 position histogram")

    data_lst = []
    for d in data:
        data_lst.append(d.week_count)

    return jsonify(data_lst)


# Get data for "The most successful songs" chart
# Parameter: limit - return only top limit songs
# {
#       'song_id': [d.song_id],
#       'total_score': [d.total_score]
# }
@app.route('/api/v1.0/topsongs')
def get_topsongs():
    session = Session()
    # SELECT song_id,
    #        sum(101 - position) AS total_score
    #   FROM Chart
    #  WHERE song_id NOT IN (
    #            SELECT song_id
    #              FROM SkipSongs
    #        )
    #  GROUP BY song_id
    #  ORDER BY total_score DESC
    #  LIMIT 25; -- can be a parameter
    try:
        limit = int(request.args.get('limit'))
        if limit < 1:
            limit = None
    except:
        limit = None

    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.sum(101-Chart.position).label('total_score')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        group_by(Chart.song_id).\
        order_by(desc('total_score'))[:limit]

    if not data:
        f.abort(404, description=f"Couldn't get data for the Top Songs chart")

    song_lst = []
    score_lst = []
    for d in data:
        song_lst.append(d.song_id)
        score_lst.append(d.total_score)

    return jsonify({
        'song_id': song_lst,
        'total_score': score_lst
    })


# Get data for "The longest playing songs"
# Parameter: limit - return only top limit songs
# {
#       'song_id': [d.song_id],
#       'weeks_count': [d.week_count]
# }
@app.route('/api/v1.0/weeksintop')
def get_weeksintop():
    session = Session()
    # SELECT song_id AS id,
    #        count(song_id) AS weeks_count
    #   FROM Chart
    #  GROUP BY song_id
    #  ORDER BY weeks_count DESC
    #  LIMIT 25; -- can be a parameter
    try:
        limit = int(request.args.get('limit'))
        if limit < 1:
            limit = None
    except:
        limit = None

    skip_ids = session.query(SkipSongs.c.song_id)
    data = session.query(
            Chart.song_id,
            func.count(Chart.song_id).label('week_count')).\
        filter(Chart.song_id.notin_(skip_ids)).\
        group_by(Chart.song_id).\
        order_by(desc('week_count'))[:limit]

    if not data:
        f.abort(404, description=f"Couldn't get data for the Longest playing songs chart")

    song_lst = []
    week_lst = []
    for d in data:
        song_lst.append(d.song_id)
        week_lst.append(d.week_count)

    return jsonify({
        'song_id': song_lst,
        'week_count': week_lst
    })


# Get data for "The most successful artist/band"
# Parameter:
#   limit - return only top limit artists
#   is_band - 0 for artists, 1 for bands. Optional parameter, if omitted return all types, including unrecognized (None)
# {
#       'artist_id': [d.artist_id]
#       'total_score': [d.total_score]
# }
@app.route('/api/v1.0/artistrating')
def get_artistrating():
    # SELECT * from ArtistRating
    #  WHERE is_band = <is_band>
    #  LIMIT 25; -- can be a parameter
    try:
        s = request.args.get('limit')
        if s:
            limit = int(s)
            if limit < 1:
                raise f"limit='{s}'"
        else:
            limit = None

        s = request.args.get('is_band')
        if s:
            is_band = int(s)
            if not is_band in [0, 1]:
                raise f"is_band='{s}'"
        else:
            is_band = None
    except e:
        f.abort(400, description="Incorrect parameter: {0}".format(e))

    session = Session()
    data = session.query(ArtistRating)
    if is_band is not None:
        data = data.filter_by(is_band = is_band)
    data = data[:limit]

    artist_lst = []
    score_lst = []
    for d in data:
        artist_lst.append(d.id)
        score_lst.append(d.total_score)

    return jsonify({
        'artist_id': artist_lst,
        'total_score': score_lst
    })


# Get data for "Longest time in the Top 100" chart
# Parameter:
#   limit - return only top limit artists
#   is_band - 0 for artists, 1 for bands. Optional parameter, if omitted return all types, including unrecognized (None)
# {
#       'artist_id': [d.artist_id]
#       'total_score': [d.total_score]
# }
@app.route('/api/v1.0/artistweeks')
def get_artistweeks():
    # SELECT * from ArtistWeeks
    #  WHERE is_band = <is_band>
    #  LIMIT 25; -- can be a parameter
    try:
        s = request.args.get('limit')
        if s:
            limit = int(s)
            if limit < 1:
                raise f"limit='{s}'"
        else:
            limit = None

        s = request.args.get('is_band')
        if s:
            is_band = int(s)
            if not is_band in [0, 1]:
                raise f"is_band='{s}'"
        else:
            is_band = None
    except e:
        f.abort(400, description="Incorrect parameter: {0}".format(e))

    session = Session()
    data = session.query(ArtistWeeks)
    if is_band is not None:
        data = data.filter_by(is_band = is_band)
    data = data[:limit]

    artist_lst = []
    week_lst = []
    for d in data:
        artist_lst.append(d.artist_id)
        week_lst.append(d.week_count)

    return jsonify({
        'artist_id': artist_lst,
        'week_count': week_lst
    })


# Starting the server

if __name__ == '__main__':
    app.run(debug=True, port=8000)
