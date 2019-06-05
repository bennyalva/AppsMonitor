from bs4 import BeautifulSoup
import requests


def invoke_site(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        response = requests.get(url, headers=headers)
        return {'status': response.status_code == 200, 'msg': 'Status Code: {}'.format(response.status_code)}
    except requests.exceptions.RequestException as ex:
        return {'status': False, 'msg': str(ex)}
    except requests.exceptions.HTTPError as ex:
        return {'status': False, 'msg': str(ex)}
    except requests.exceptions.ConnectionError as ex:
        return {'status': False, 'msg': str(ex)}
    except requests.exceptions.Timeout as ex:
        return {'status': False, 'msg': str(ex)}
    except requests.exceptions.RequestException as ex:
        return {'status': False, 'msg': str(ex)}
    except Exception as ex:
        return {'status': False, 'msg': str(ex)}


def parse_response(html_response):
    soup = BeautifulSoup(html_response, 'html.parser')
    return soup.prettify()
