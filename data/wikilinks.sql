-- Temporary table used for Wikipedia scraping

CREATE TABLE "WikiLinks" (
    "artist_id" INT PRIMARY KEY,
    "url" TEXT NULL,
    FOREIGN KEY ("artist_id") REFERENCES "Artist"("id")
)

GO
