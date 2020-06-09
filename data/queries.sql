-- Line chart x:week_number, y:score(position)
SELECT id,
       week_number,
       position,
       score
  FROM SongEvolution
 WHERE top_position <= 25 AND 
       week_count > 4;


-- Scatter plot: x:week_count, y:top_position
SELECT song_id,
       count(song_id) AS week_count,
       min(position) AS top_position
  FROM Chart
 WHERE song_id NOT IN (
           SELECT song_id
             FROM SkipSongs
       )
 GROUP BY song_id;


-- Histogramm: week_count in the chart
SELECT song_id,
       count(song_id) AS week_count
  FROM Chart
 WHERE song_id NOT IN (
           SELECT song_id
             FROM SkipSongs
       )
 GROUP BY song_id;


-- Histogramm: top position (score?)
SELECT song_id,
       min(position) AS top_position
  FROM Chart
 WHERE song_id NOT IN (
           SELECT id
             FROM SkipSongs
       )
 GROUP BY song_id;


-- Histogramm: How long a song is usually on the top
SELECT song_id,
       count(song_id) AS in_top
  FROM Chart
 WHERE song_id NOT IN (
           SELECT song_id
             FROM SkipSongs
       )
AND 
       position = 1
 GROUP BY song_id;


-- Top songs (highest score)
SELECT song_id,
       sum(101 - position) AS total_score
  FROM Chart
 WHERE song_id NOT IN (
           SELECT song_id
             FROM SkipSongs
       )
 GROUP BY song_id
 ORDER BY total_score DESC
 LIMIT 25;


-- Longest in the chart (song)
SELECT song_id AS id,
       count(song_id) AS weeks_count
  FROM Chart
 GROUP BY song_id
 ORDER BY weeks_count DESC
 LIMIT 25;


-- See other queries as views: ArtistRating, ArtistWeeks, SongEvolution
