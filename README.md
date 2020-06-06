# Project 2: Visualize Music Trends
UT-TOR-DATA-PT-01-2020-U-C Group Project 2


## Chosen Topic and Rationale

Top 100 music charts. With the available data provided by the acharts page (scraped) we will be creating an interactive dashboard that will allow you to see patterns beyond the weekly music trends. 

Length of time song is on the chart in relation to genre, artist age, country. Overall most popular genres, average artist age.


## Link to datasets

* Candian top singles: [Data from 2007 to current week (updated weekly)](https://acharts.co/canada_singles_top_100#archive)
  * Pages are accessed via URLs in the form `https://acharts.co/canada_singles_top_100/{year}/{week}` and then scraped using splinter library
  * For each line in the Top-list the scraper gets chart position, song name and song performer
  * Then, the song performer is split using HTML markup into a list of artists and bands that collaborated on this song
  * This information is saved into the SQLite database and becomes the foundation of further data scraping

* Artist information: Genre, age, photo etc. is obtained by scraping Wikipedia pages with Splinter library.
  * First stage is to form a list of URLs to wikipedia pages using Wikipedia and Google search
  * Second stage is by using that list of URLs open Wikipedia page, detect if it is a person or a band and scrape information
  * The detection is done by analizing a side table wich is present on every page
  * Example page of an artist: [Billie Eilish](https://en.wikipedia.org/wiki/Billie_Eilish)
  * Example page of a band: [Surfaces](https://en.wikipedia.org/wiki/Surfaces_(band))

* Flask server provides interface between the Database and the Front end by means of endpoints
  * Each endpoint returns data specific to the task: a chart, a list, a search query
  * On the database side common queries are implemented as Views to ease the access

## Inspiration visualization

1. Line graph showing song growth: superposition of all song life-lines from first entry to the chart until last exit (there might be reentries). (rank vs weeks)

| Superposition | Single |
| ------------- | ------ |
| ![Multiple lines](images/lines.png) | ![Single line](images/line.png) |


2. Genre information: each bubble is a genre and bubbles inside are artists/songs (size will represent popularity)- zoomable sunburst & zoomable circle packing -- plotly

| Sunburst | Bubbles |
| -------- | ------- |
| ![Sunburst](images/sunrays.jpg) | ![Bubbles](images/bubbles.jpg) |


3. Timeline of artist-- singles that made the chart (each bar is single- height of bar is how long it was popular)


4. Word cloud: get a numerical metric to measure an artist’s success and create a word cloud of popular music

![Word cloud](images/words.png)


5. Bar chart for genre/gender(male, female, band) (stacked to group bar chart)

![Bars](images/bars.jpg)


