# Independant instructions to scrape wikipedia for artist information
# Search based on artist/band name -- wiki link
from bs4 import BeautifulSoup
import requests
import pandas as pd

url= "https://en.wikipedia.org/wiki/Lil_Wayne"

# ---------------------------------
# Step 1: Get Info Table
req = requests.get(url)
soup = BeautifulSoup(req.content, 'html.parser')
artist_table=soup.find('table', class_='infobox')

# Get Image info
table_img=artist_table.find('img')['src']
image_src= 'https:'+ table_img
# print(image_src)

# set up empty dictionary(s) for band or artist
band_dict= {'Origin':'null', 
             'Genres':'null'
             }
artist_dict= {'Genres':'null',
            'Born':'null',
             }

# If statement to differentiate bands/artist:
if artist_table.find(text = "Members"):
    print('Band---')
    
    for item in band_dict:
        row_text=artist_table.tr.find_next('th', string=item, scope='row').find_next('td').find_next('a').text
        band_dict.update({item: row_text})
    
    
    band_dict.update({'img':image_src,'is_band':1})
    print(band_dict)
    
else:
    print('Artist---')
    for item in artist_dict:
        
        row_text=artist_table.tr.find_next('th', string=item, scope='row').find_next('td').find_next('a').text
        artist_dict.update({item: row_text})
    
    bday= artist_table.tr.find_next(class_='bday').text

    artist_dict.update({'img':image_src, 'is_band':0, 'DOB':bday})
    print(artist_dict)