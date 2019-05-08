from bs4 import BeautifulSoup
import requests

def invoke_site(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    response = requests.get(url, headers=headers)
    return response

def parse_response(html_response):
    soup = BeautifulSoup(html_response, 'html.parser')
    return soup.prettify()