import webscrapping
import port_checker
import db_monitor
import mongo
import cron_task
from api_routes import app

def main():
    cron_task.schedule_job()
    # response = webscrapping.invoke_site('http://Google.com/')
    # print('status code', response.status_code)

    # parsed_response = webscrapping.parse_response(response.text)
    # find = str(parsed_response).find("Google")
    # print('find', find)

    # port_opened = port_checker.check_port('192.168.0.84', 30000)
    # print('port_opened', port_opened)

    # result = db_monitor.verify_connection('ODBC Driver 17 for SQL Server', '127.0.0.1', 'cinepolis', 'sa', 'Axity!2019Swd')
    # print('result', result)

    # mon = mongo.MongoManager()
    # id = mon.insert()
    # print('id', id)


if __name__ == '__main__':
    main()
    app.run(host='0.0.0.0', port=3000)