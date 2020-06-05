## Search on ask.com for artist then save the wiki url to be used in wiki_scrape

from splinter import Browser
from bs4 import BeautifulSoup

executable_path = {'executable_path': 'chromedriver.exe'}
browser = Browser('chrome', **executable_path, headless=False)

url = 'https://www.ask.com/'
browser.visit(url)
# browser.fill('q', 'data analyst')
# button=browser.find_by_text('Find Jobs')
# button.click()