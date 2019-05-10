import mongo
import webscrapping
import port_checker
import db_monitor
from datetime import datetime

class Crawler:
        
    def __init__(self):
        self.mgo = mongo.MongoManager()
        points = self.get_points()
        for point in points:
            self.process(point)

    def get_points(self):
        return self.mgo.get_list('points', {})
    
    def process(self, point):
        print('monitoring_application:', point['application'])
        self.webscrapping(point['application'], point['sites'])
        # self.port_open(point['application'], point['services'])
        self.database_status(point['application'], point['databases'])
        print('monitoring_application_finish:', point['application'])
        
    def webscrapping(self, application, sites):
        for site in sites:
            print('webscrapping_to:', site['url'])
            result = webscrapping.invoke_site(site['url'])
            print('webscrapping_to_response:', result)
            # find = str(parsed_response).find("Google")
            self.persist_event(application, 'sites', site['name'], result['msg'], result['status'])
    
    def port_open(self, application, services):
        for service in services:
            print('connecting_to_port:', '{}:{}'.format(service['ip'], service['port']))
            result = port_checker.check_port(service['ip'], service['port'])
            print('connecting_to_port_response:', result)
            self.persist_event(application, 'services', service['name'], result, result)
    
    def database_status(self, application, databases):
        for database in databases:
            print('verifying_dbconnection_to: ', 'ip:{}, db:{}'.format(database['ip'], database['database']))
            result = db_monitor.verify_connection('ODBC Driver 17 for SQL Server', database['ip'], database['database'], database['usr'], database['pwd'])
            print('verifying_dbconnection_to_response: ', result)
            self.persist_event(application, 'databases', database['name'], result['msg'], result['status'])

    def persist_event(self, application, type, name, status_response, status):
        event = {
            'datetime': datetime.now(),
            'application': application,
            'type': type,
            'name': name,
            'status_response': status_response,
            'status': status
        }
        self.mgo.insert('events', event)


