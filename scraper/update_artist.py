# UT-TOR-DATA-PT-01-2020-U-C Group Project 2
# Functions for using with Wikipedia scraper

# SQLite Database related imports
import sqlalchemy
from sqlalchemy.engine import Engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, event, inspect

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
WikiLinks = AutomapBase.classes.WikiLinks

# Create our session (link) from Python to the DB
session = Session(engine)


# Function returns the list of URLs to Wikipedia pages
def get_wikilinks():
    return session.query(WikiLinks.artist_id, WikiLinks.url).filter(WikiLinks.url != None).all()

# Function updates Artist table with scraped data
def update_artist(artist_id, url, data):
    if data['is_band']: # It's a band
        session.query(Artist).\
            filter(Artist.id == artist_id).\
            update({
                'is_band' : 1,
                'genre' : data.get('Genres'),
                'image' : data.get('img'),
                'wiki' : url,
                'dob' : None,
                'origin' : data.get('Origin')
            })
    else: # It's an artist
        session.query(Artist).\
            filter(Artist.id == artist_id).\
            update({
                'is_band' : 0,
                'genre' : data.get('Genres'),
                'image' : data.get('img'),
                'wiki' : url,
                'dob' : data.get('DOB'),
                'origin' : data.get('Born')
            })

    session.commit()

# Data examples
# band = {
#   'Origin': 'Los Angeles',
#   'Genres': 'Pop',
#   'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Black_Eyed_Peas_performing_at_O2_Apollo_Manchester_Nov2018.jpeg/300px-Black_Eyed_Peas_performing_at_O2_Apollo_Manchester_Nov2018.jpeg',
#   'is_band': 1
#  }
# artist = {
#   'Genres': 'Hip hop',
#   'Born': 'New Orleans',
#   'img': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Lil_Wayne_%2823513397583%29.jpg/220px-Lil_Wayne_%2823513397583%29.jpg',
#   'is_band': 0,
#   'DOB': '1982-09-27'
# }

# Main scraping loop
links = get_wikilinks()
from wiki_scrape import scrape_wikipedia

for link in links:
    link_dct = link._asdict()
    artist_id = link_dct['artist_id']
    url = link_dct['url']

    # Call scraping function here.
    # I Suppose it returns a dictionary as in above examples or None if scraping failed
    data = scrape_wikipedia(url)

    if data is not None:
        update_artist(artist_id, url, data)
        print(f"Artist id={artist_id} updated")
    else:
        print(f"Artist id={artist_id} scraping failed")

print("Done")

