# UT-TOR-DATA-PT-01-2020-U-C Group Project 2
# Flask server

import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, event, inspect

import flask as f
from flask import Flask, request, escape, jsonify

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
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


#################################################
# Flask Routes
#################################################

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

if __name__ == '__main__':
    app.run(debug=True, port=8000)
