# Independant instructions to scrape wikipedia for artist information
# Search based on artist/band name -- wiki link
def scrape_wikipedia(url): 

    from bs4 import BeautifulSoup
    import requests
    import pandas as pd
    print(url)

    # ---------------------------------
    # Step 1: Get Info Table
    req = requests.get(url)
    soup = BeautifulSoup(req.content, 'html.parser')
    artist_table=soup.find('table', class_='infobox')

    # set up empty dictionary(s) for band or artist
    band_dict= {'Origin':None, 
                'Genres':None
                }
    artist_dict= {'Genres':None,
                'Born':None,
                }

    # try and except block if wiki link not available/not working as anticipated
    try:
        # If statement to differentiate bands/artist:
        if artist_table.find(text = "Members"):
            print('Band---')
            # Get Image info (if no image available return 'none')
            try:
                table_img=artist_table.find('img')['src']
                image_src= 'https:'+ table_img
            except TypeError as error:
                print(error,': No image available')
                image_src = None

            print(image_src)
            for item in band_dict:
                row_text=artist_table.tr.find_next('th', string=item, scope='row').find_next('td').find_next('a').text
                band_dict.update({item: row_text})
            
            
            band_dict.update({'img':image_src,'is_band':1})
            print(band_dict)
            return(band_dict)
            
        elif artist_table.find(text = "Born"):
            print('Artist---')
            # Get Image info (if no image available return 'none')
            try:
                table_img=artist_table.find('img')['src']
                image_src= 'https:'+ table_img
            except TypeError as error:
                print(error,': No image available')
                image_src= None

            for item in artist_dict:
                
                row_text=artist_table.tr.find_next('th', string=item, scope='row').find_next('td').find_next('a').text
                artist_dict.update({item: row_text})
            
            bday= artist_table.tr.find_next(class_='bday').text

            artist_dict.update({'img':image_src, 'is_band':0, 'DOB':bday})
            print(artist_dict)
            return (artist_dict)
    
    except AttributeError as error:
        print('Error has occured: ', error)
        return(None)

