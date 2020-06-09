-- UT-TOR-DATA-PT-01-2020-U-C Group Project 2
-- ------------------------------------------
-- Script to create views in the database
-- Some views are accesories: StartWeek, LastWeeks,
-- WeekNumbers, SkipSongs, CurrentSongs
-- Their purpose is to wrap some common queries
-- Other views are used by the server part as "saved queries": SongEvolution

-- Return first year and week of the dataset
-- Result: 2007 22
CREATE VIEW StartWeek AS
    SELECT year,
           min(week) AS week
      FROM Chart
     WHERE year IN (
               SELECT min(year) 
                 FROM Chart
           );


-- Return last week number of every year
-- Most years have 52 weeks, some - 53 weeks, current year - last week 
CREATE VIEW LastWeeks AS
    SELECT year,
           max(week) AS week
      FROM Chart
     GROUP BY (year);


-- Through numbering of weeks from the first (2007/22) to the last (the most recent)
CREATE VIEW WeekNumbers AS
    SELECT year,
           week,
           row_number() OVER (ORDER BY year, week) AS week_number
    FROM Chart
    GROUP BY year, week;


-- Ids of the songs in the current week's chart
CREATE VIEW CurrentSongs AS
    SELECT c.song_id
      FROM (
               (
                   SELECT max(year) AS year,
                          week
                     FROM LastWeeks
               )
               AS l
               JOIN
               Chart AS c ON c.year = l.year AND 
                             c.week = l.week
           );


-- Songs that shouldn't be included into the analysis
-- Those are:
-- 1. Songs from the very first week, because we don't know how long they had been in the charts
-- 2. Songs in the latest week, because we don't know how long thea will be there
-- P.S. That is questionable, whether exclude current hits or not. At least we know when they got to the chart
CREATE VIEW SkipSongs AS
    SELECT c.song_id
      FROM (
               (-- First week's chart
                   SELECT year,
                          week
                     FROM StartWeek
                -- Most recent chart
--                   UNION
--                   SELECT max(year) AS year,
--                          week
--                     FROM LastWeeks
               )
               AS s
               JOIN
               Chart AS c ON s.year = c.year AND 
                             s.week = c.week
           );


-- Megaview - too complex, too heavy
-- All the songs (exluding SkipSongs above)
-- Their evolution week by week with through week numbering (no dates)
-- All chart positions, top position, duration
-- CREATE VIEW SongEvolution AS
--     SELECT c.song_id AS id,
--            w.week_number - m.min_number AS week_number,
--            c.position,
--            101 - c.position AS score,
--            m.top_position,
--            m.cnt AS week_count
--       FROM (-- Subquery to calculate song statistics: when, how long, how high
--                SELECT c.song_id AS id,
--                       min(w.week_number) AS min_number, -- the  week when the song got to the chart for the first time
--                       min(c.position) AS top_position,  -- the highest position of the song in the chart
--                       count(c.song_id) AS cnt           -- how many weeks the song stayed in the chart
--                  FROM Chart AS c
--                       JOIN
--                       WeekNumbers AS w ON c.year = w.year AND 
--                                           c.week = w.week
--                 WHERE c.song_id NOT IN (-- exclude songs with incomplete data
--                           SELECT id
--                             FROM SkipSongs
--                       )
--                 GROUP BY c.song_id
--            ) AS m
--            JOIN
--            Chart AS c ON c.song_id = m.id
--            JOIN
--            WeekNumbers AS w ON c.year = w.year AND 
--                                c.week = w.week
--      ORDER BY c.song_id;

-- All the songs (exluding SkipSongs above)
-- Their evolution week by week with through week numbering (no dates)
CREATE VIEW SongEvolution AS
    SELECT song_id,
           row_number() OVER (PARTITION BY song_id ORDER BY year, week) AS week_number,
           position,
           101 - position AS score
      FROM Chart
      WHERE song_id NOT IN (SELECT song_id FROM SkipSongs); 


-- The most successful artist (or band) by score
CREATE VIEW ArtistRating AS
    SELECT a.id,
           a.name,
           a.is_band,
           a.genre,
           s.total_score
      FROM (
               SELECT p.artist_id,
                      sum(s.song_score) AS total_score
                 FROM (
                          SELECT song_id,
                                 sum(101 - position) AS song_score
                            FROM Chart
                           GROUP BY song_id
                      )
                      AS s
                      JOIN
                      Performed_by AS p ON p.song_id = s.song_id
                GROUP BY p.artist_id
           )
           AS s
           JOIN
           Artist AS a ON s.artist_id = a.id
     ORDER BY total_score DESC;

-- Artists whos names were in the chart for the longest time (in weeks)
-- If there we more then one song in a week, this week counts only once.
CREATE VIEW ArtistWeeks AS
    SELECT s.artist_id,
           a.name,
           a.is_band,
           a.genre,
           count(s.week) AS week_count
      FROM (
               SELECT p.artist_id,
                      c.year,
                      c.week,
                      count(c.song_id) 
                 FROM Performed_by AS p
                      JOIN
                      Chart AS c ON p.song_id = c.song_id
                GROUP BY p.artist_id,
                         c.year,
                         c.week
           )
           AS s
           JOIN
           Artist AS a ON s.artist_id = a.id
     GROUP BY s.artist_id
     ORDER BY week_count DESC;
