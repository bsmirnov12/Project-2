# Independant instructions to scrape wikipedia for artist information
# Search based on artist/band name -- wiki link

from bs4 import BeautifulSoup
import requests
import re
import pandas as pd

url= "https://en.wikipedia.org/wiki/The_Chainsmokers"



# Relevant information (variables):
# genre, image (src), wiki link, dob, origin
band = []
genre = []
image = []
link = []
dob = []
origin = []

# ---------------------------------
# Step 1: Get Info Table
req = requests.get(url)
soup = BeautifulSoup(req.content, 'html.parser')

info_table = soup.find(class_="infobox")
# print(info_table)
members= info_table.find(text = "Members") 

# ---------------------------------
# Step 2: Artist or band?
if info_table.find(text = "Members"):
    band.append(True)
    ##band has "members section"
else:
    band.append(False)
    ##artist does not have members

# ---------------------------------
# Step 2: Genre 
genre=info_table.select("tbody")[0]
# print(genre)
columns = info_table.findAll('td', text = re.compile('Genres'), attrs = {'class' : 'pos'})
genres=genre.find(text="Genres")
# print(genres)
Tables = pd.read_html(url)
print(Tables[0])
