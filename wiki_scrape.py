# Independant instructions to scrape wikipedia for artist information
# Search based on artist/band name -- wiki link

from bs4 import BeautifulSoup
import requests
import pandas as pd

url= "https://en.wikipedia.org/wiki/The_Chainsmokers"

# Relevant information (variables):
# genre, image (src), wiki link, dob, origin

# ---------------------------------
# Step 1: Get Info Table
req = requests.get(url)
soup = BeautifulSoup(req.content, 'html.parser')
artist_table=soup.find('table', class_='infobox')

table_img=artist_table.find('img')['src']
image_src= 'https://'+ table_img
print(image_src)

# Row information
row_titles = []
row_info = []

for row in artist_table.select('tr'):
    table_row = row.find(text=True)
#     print(table_row)
    
    row_titles.append(table_row)
    table_data= row.select('td')
    
#     print(table_data)
    
    for item in table_data:
        text=item.find(text=True)
        row_info.append(text)

# get index of titles then get information from within the rows
# print('Row titles: ',row_titles)
# print('---------')
# print('Row information: ',row_info)

# ---------------------------------
# Step 2: Artist or band?
if artist_table.find(text = "Members"):
    print("Band")
    ##band has "members" section- now loop through the row index's to fill in dictionary
    # Look for string in the list for 'Origin', 'Genres', 'Image' etc
    band_dict= {'Origin':'null', 
                'Genres':'null',
                }

    for item in band_dict:
    #     print(item)
        if item in row_titles:
            item_index= row_titles.index(item)-1
    #         print(f'{item}: index {item_index}')
    #         print(item_index)
            
        else:
            print(f'{item} not available')
        
    #   update the dictionary
        band_dict.update({item: row_info[int(item_index-1)]})
        
        
    band_dict.update({'img':image_src})
    print(band_dict)
else:
    print('Artist:')
    ##artist does not have members
    artist_dict = {'Origin':'null', 
             'Genres':'null', 
             'Born':'null'
             }
    for item in artist_dict:
        
        if item in row_titles:
            item_index= row_titles.index(item)-1
            #print(f'{item}: index {item_index}')
            #print(item_index)
            
        else:
            print(f'{item} not available')
        
    #   update the dictionary
        artist_dict.update({item: row_info[int(item_index-1)]})

    artist_dict.update({'img':image_src})

