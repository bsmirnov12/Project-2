# API Documentation

## Table of Contents

* [General Info Endpoints](#general-info-endpoints)
    * [Song information](#song-information)
    * [Songs list](#songs-list)
    * [Artist Information](#artist-information)
    * [Artists list](#artists-list)
    * [List of last week numbers for each year](#list-of-last-week-numbers-for-each-year)
* [Chart data endpoints](#chart-data-endpoints)
    * [Song Evolution Chart](#song-evolution-chart)
    * ['Weeks in Top 100 and highest position' scatter plot](#weeks-in-top-100-and-highest-position-scatter-plot)
* [Histograms](#histograms)
    * [Songs: Week count](#songs-week-count)
    * [Songs: Top position](#songs-top-position)
    * [Songs: Weeks in Top 1](#songs-weeks-in-top-1)
* [Bar Charts](#bar-charts)
    * [Songs: Most successful songs](#songs-most-successful-songs)
    * [Songs: The longest in the Top songs](#songs-the-longest-in-the-top-songs)
    * [Artists: The most successful artist/band](#artists-the-most-successful-artistband)
    * [Artist: Longest time in the Top 100](#artist-longest-time-in-the-top-100)

## General Info Endpoints

### Song information

* Endpoint: `/api/v1.0/song/<int:song_id>`
* Description:
    * returns information about a song with a given song id
    * also includes an array of performers (see ['Artist Information'](#artist-information) endpoint)
* Example: (http://localhost:8000/api/v1.0/song/1)
```JSON
{
  "song_name": "Stuck With U", 
  "performed_by": "Ariana Grande and Justin Bieber", 
  "id": 1, 
  "performers": [
    {
      "genre": "Pop", 
      "name": "Ariana Grande", 
      "wiki": "https://en.wikipedia.org/wiki/Ariana_Grande", 
      "origin": "Boca Raton, Florida", 
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png/220px-Ariana_Grande_Grammys_Red_Carpet_2020.png", 
      "id": 1, 
      "is_band": 0, 
      "dob": "1993-06-26"
    }, 
    {
      "genre": "Pop", 
      "name": "Justin Bieber", 
      "wiki": "https://en.wikipedia.org/wiki/Justin_Bieber", 
      "origin": "[1]", 
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Justin_Bieber_in_2015.jpg/220px-Justin_Bieber_in_2015.jpg", 
      "id": 2, 
      "is_band": 0, 
      "dob": "1994-03-01"
    }
  ]
}
```

### Songs list

* Endpoint: `/api/v1.0/songs?ids=<comma separated list of ids>`
* Description:
    * returns an array of songs in the format as returned by ['Song Information'](#song-information) endpoint
    * if `ids` parameter is missing or a list of IDs is malformed, returns empty list
* Example: (http://localhost:8000/api/v1.0/songs?ids=2,3)
```JSON
[
  {
    "song_name": "Gooba", 
    "performed_by": "6ix9ine", 
    "id": 2, 
    "performers": [
      {
        "genre": "Hip hop", 
        "name": "6ix9ine", 
        "wiki": "https://en.wikipedia.org/wiki/6ix9ine", 
        "origin": "New York City", 
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/6ix9ine.jpg/220px-6ix9ine.jpg", 
        "id": 3, 
        "is_band": 0, 
        "dob": "1996-05-08"
      }
    ]
  }, 
  {
    "song_name": "Blinding Lights", 
    "performed_by": "The Weeknd", 
    "id": 3, 
    "performers": [
      {
        "genre": "R&B", 
        "name": "The Weeknd", 
        "wiki": "https://en.wikipedia.org/wiki/The_Weeknd", 
        "origin": "Toronto", 
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/FEQ_July_2018_The_Weeknd_%2844778856382%29_%28cropped%29.jpg/220px-FEQ_July_2018_The_Weeknd_%2844778856382%29_%28cropped%29.jpg", 
        "id": 4, 
        "is_band": 0, 
        "dob": "1990-02-16"
      }
    ]
  }
]
```

### Artist Information

* Endpoint: `/api/v1.0/artist/<int:artist_id>`
* Description:
    * returns information about an artist with a given artist id
* Example: (http://localhost:8000/api/v1.0/artist/1)
```JSON
{
  "genre": "Pop", 
  "name": "Ariana Grande", 
  "wiki": "https://en.wikipedia.org/wiki/Ariana_Grande", 
  "origin": "Boca Raton, Florida", 
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png/220px-Ariana_Grande_Grammys_Red_Carpet_2020.png", 
  "id": 1, 
  "is_band": 0, 
  "dob": "1993-06-26"
}
```

### Artists list

* Endpoint: `/api/v1.0/artists?ids=<comma separated list of ids>`
* Description:
    * returns an array of artists in the format as returned by ['Artist Information'](#artist-information) endpoint
    * if `ids` parameter is missing or a list of IDs is malformed, returns empty list
* Example: (http://localhost:8000/api/v1.0/artists?ids=1,24)
```JSON
[
  {
    "genre": "Pop", 
    "name": "Ariana Grande", 
    "wiki": "https://en.wikipedia.org/wiki/Ariana_Grande", 
    "origin": "Boca Raton, Florida", 
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ariana_Grande_Grammys_Red_Carpet_2020.png/220px-Ariana_Grande_Grammys_Red_Carpet_2020.png", 
    "id": 1, 
    "is_band": 0, 
    "dob": "1993-06-26"
  }, 
  {
    "genre": "Pop", 
    "name": "Maroon 5", 
    "wiki": "https://en.wikipedia.org/wiki/Maroon_5", 
    "origin": "Los Angeles", 
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Maroon_5_performing_in_Sydney.jpg/300px-Maroon_5_performing_in_Sydney.jpg", 
    "id": 24, 
    "is_band": 1, 
    "dob": null
  }
]
```

### List of last week numbers for each year

* Endpoint: `/api/v1.0/lastweeks`
* Description: 
    * returns an array of last weeks numbers for each year
    * most years have 52 weeks in them, but some - 53, and current year's last week is the week of last publication of Top 100
* Example: (http://localhost:8000/api/v1.0/lastweeks)
```JSON
[
  {
    "year": 2007, 
    "week": 52
  }, 
...
]
```

## Chart data endpoints

### Song Evolution Chart

* Endpoint: `/api/v1.0/evolution?years=<comma separated list of years>&above=<int>&below=<int>&more=<int>&less=<int>`
* Description:
    * The chart shows evolution of each song from when it first entered the chart, until it left
    * The data for each song includes:
        * Song id, name and performer
        * Array with ordinal numbers of weeks startting from 1 and ending with the week number the song left Top 100.
        * Array of Top 100 chart position for each week
        * Array of scores (101 - chart position) for each week 
    * Array of week numbers is meant for X-axis, array of score - for Y-axis values, array of positions - for Y-axis labels
    * Additional filtering parameters:
        * years - comma separeted list of years. Include only songs that were in Top 100 during specified years
        * above - include only songs which position number was <=above (above=50 - top half of Top 100, #1 hits and below to #50)
        * below - include only songs which position number was >=below (below=50 - bottom half of Top 100, from #50 to #100)
        * more - include only songs which stayed in Top 100 >=more number of weeks
        * less - include only songs which stayed in Top 100 <=less number of weeks
* Example: (http://localhost:8000/api/v1.0/evolution?years=2020&above=5&below=2&more=30&less=40)
```JSON
[
  {
    "id": 8, 
    "name": "Don't Start Now", 
    "performer": "Dua Lipa", 
    "week": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], 
    "position": [16,22,19,20,17,19,23,27,14,10,10,12,12,8,3,3,3,3,3,3,4,3,4,3,3,5,5,7,5,6,8], 
    "score": [85,79,82,81,84,82,78,74,87,91,91,89,89,93,98,98,98,98,98,98,97,98,97,98,98,96,96,94,96,95,93]
  }, 
  ...
  {
    "id": 44, 
    "name": "Roxanne", 
    "performer": "Arizona Zervas", 
    "week": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32], 
    "position": [82,17,9,5,4,5,4,3,4,4,6,6,6,6,3,9,8,6,6,9,7,9,11,14,20,32,35,50,43,38,43,44], 
    "score": [19,84,92,96,97,96,97,98,97,97,95,95,95,95,98,92,93,95,95,92,94,92,90,87,81,69,66,51,58,63,58,57]
  }
]
```

### 'Weeks in Top 100 and highest position' scatter plot

* Endpoint: `/api/v1.0/scatter`
* Description:
    * The chart shows if there is any depedency between how long a song was in the Top 100 and how high it got
    * Each data point is a song, number of weeks it was in the Top 100, and its highest position
* Example (only first 3 songs are shown): (http://localhost:8000/api/v1.0/scatter)
```JSON
[
  {
    "song_id": 1, 
    "top_position": 1, 
    "week_count": 1
  }, 
  {
    "song_id": 2, 
    "top_position": 2, 
    "week_count": 1
  }, 
  {
    "song_id": 3, 
    "top_position": 1, 
    "week_count": 24
  },
...
]
```

## Histograms

### Songs: Week count

* Endpoint: `/api/v1.0/weekshist`
* Description:
    * The histogram shows distribution of songs by how long they were in Top 100
    * X-axis - number of weeks in the Top 100 (or 'buckets' of ranges of weeks)
    * Y-axis - frequency of such longevity (number of songs that stayed that long in Top 100)
    * Returns an array of week counts for each song
* Example: (http://localhost:8000/api/v1.0/weekshist)
```JSON
[1,1,24,8,20,6,28,4,14,37,3,39,23, ...]
```

### Songs: Top position

* Endpoint: `/api/v1.0/tophist`
* Description:
    * The histogram shows distribution of songs by high they got in Top 100
    * X-axis - the highest position of songs (or 'buckets' of ranges of positions)
    * Y-axis - frequency (number of songs that reached that position in Top 100)
    * Returns an array of top positions of each song
* Example: (http://localhost:8000/api/v1.0/tophist)
```JSON
[1,2,1,3,3,2,3,8,4,2,1,1,10,9, ...]
```

### Songs: Weeks in Top 1

* Endpoint: `/api/v1.0/weekstop1hist`
* Description:
    * The histogram shows how many weeks a song can be a Top 1 song
    * X-axis - number of weeks a song was Top 1 hit
    * Y-axis - frequency (number of songs that spend that many weeks as a Top 1 hit)
    * Returns an array of week counts
* Example: (http://localhost:8000/api/v1.0/weekstop1hist)
```JSON
[1,6,1,7,4,10,7,1,19, ...]
```

## Bar Charts

### Songs: Most successful songs

* Endpoint: `/api/v1.0/topsongs?limit=<number of songs>`
* Description:
    * Returns an object with 2 lists: song IDs and corresponding scores, highest score first
    * Score is calculated by song position in Top 100. 1st place - 100 points, 100th place - 1 point.
    * Song rating is a sum of scores for all weeks the song was in Top 100
    * Optional parameter `limit` specifies how many songs to return, e.g. limit=3 returns top 3 songs
    * Detailed song information can be obtained via ['Songs list'](#songs-list) endpoint by supplying the list of song IDs
* Example: (http://localhost:8000/api/v1.0/topsongs?limit=3)
```JSON
{
  "song_id": [4647,1376,3583], 
  "total_score": [6352,5796,5753]
}
```
* Example of JS to query detailed song information:
```javascript
var data = [], song_info = {};
const query1 = '/api/v1.0/topsongs?limit=10'
d3.json(query1)
    .then(response1 => {
        data = response1;
        let ids = response1['song_id'].join(',');
        let query2 = '/api/v1.0/songs?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(song => { song_info[song.id] = song });
        // Draw chart with data. Use data['total_score'] for X-axis, data['song_id'] for Y-axis, or the other way around
        // Add tooltips with song_info, use song_info[song_id] to get the deatils
    });
```

### Songs: The longest in the Top songs

* Endpoint: `/api/v1.0/weeksintop?limit=<number of songs>`
* Description:
    * Returns a list of songs that stayed the longest in Top 100
    * Optional parameter `limit` specifies how many songs to return, e.g. limit=3 returns top 3 songs
    * Detailed song information can be obtained via ['Songs list'](#songs-list) endpoint by supplying the list of song IDs
* Example: (http://localhost:8000/api/v1.0/weeksintop?limit=3)
```JSON
{
  "song_id": [4647,3583,3099], 
  "week_count": [76,74,71]
}
```
* Example of JS to query detailed song information:
```javascript
var data = [], song_info = {};
const query1 = '/api/v1.0/weeksintop?limit=10'
d3.json(query1)
    .then(response1 => {
        data = response1;
        let ids = response1['song_id'].join(',');
        let query2 = '/api/v1.0/songs?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(song => { song_info[song.id] = song });
        // Draw chart with data. Use data['week_count'] for X-axis, data['song_id'] for Y-axis, or the other way around
        // Add tooltips with song_info, use song_info[song_id] to get the deatils
    });
```

### Artists: The most successful artist/band

* Endpoint: `/api/v1.0/artistrating?limit=<number of artists>&is_band=<0 or 1>`
* Description:
    * Returns a list of artists/bands sorted by score, highest score first
    * Artist's score is defined by the sum of song scores this artist performed
    * How song scores are calculated is described in ['Most successful songs'](#most-successful-songs)
    * Optional parameter `limit` specifies how many artists to return, e.g. limit=3 returns top 3 artists
    * Optional parameter `is_band` specifies wether to return a list of artists (0) or bands (1). If omitted return all, including uncategorized performers (no data in DB)
    * Detailed artists information can be obtained via ['Artists list'](#artists-list) endpoint by supplying the list of artist IDs
* Example: (http://localhost:8000/api/v1.0/artistrating?limit=3&is_band=0)
```JSON
{
  "artist_id": [7,67,120], 
  "total_score": [96180,81742,60251]
}
```
* Example of JS to query detailed song information:
```javascript
var data = [], artist_info = {};
const query1 = '/api/v1.0/artistrating?limit=10'
d3.json(query1)
    .then(response1 => {
        data = response1;
        let ids = response1['artist_id'].join(',');
        let query2 = '/api/v1.0/artists?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(artist => { artist_info[artist.id] = artist });
        // Draw chart with data. Use data['total_score'] for X-axis, data['artist_id'] for Y-axis, or the other way around
        // Add tooltips with artist_info, use artist_info[artist_id] to get the deatils
    });
```

### Artist: Longest time in the Top 100

* Endpoint: `/api/v1.0/artistweeks?limit=<number of artists>&is_band=<0 or 1>`
* Description:
    * Returns a list of artists/bands whos names were in Top 100 the longest time
    * A week is counted towards an artist if his/her/its song (one or more) was in Top 100 that week
    * Optional parameter `limit` specifies how many artists to return, e.g. limit=3 returns top 3 artists
    * Optional parameter `is_band` specifies wether to return a list of artists (0) or bands (1). If omitted return all, including uncategorized performers (no data in DB)
    * Detailed artists information can be obtained via ['Artists list'](#artists-list) endpoint by supplying the list of artist IDs
* Example: (http://localhost:8000/api/v1.0/artistweeks?limit=3&is_band=1)
```JSON
{
  "artist_id": [24,644,342], 
  "week_count": [453,425,316]
}
```
* Example of JS to query detailed song information:
```javascript
var data = [], artist_info = {};
const query1 = '/api/v1.0/artistweeks?limit=10'
d3.json(query1)
    .then(response1 => {
        data = response1;
        let ids = response1['artist_id'].join(',');
        let query2 = '/api/v1.0/artists?ids=' + ids;
        return d3.json(query2)
    })
    .then(response2 => {
        response2.forEach(artist => { artist_info[artist.id] = artist });
        // Draw chart with data. Use data['week_count'] for X-axis, data['artist_id'] for Y-axis, or the other way around
        // Add tooltips with artist_info, use artist_info[artist_id] to get the deatils
    });
```
