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
        self.webscrapping(point['application'], point['sites'])
        # self.port_open(point['application'], point['services'])
        self.database_status(point['application'], point['databases'])
        
    def webscrapping(self, application, sites):
        for site in sites:
            response = webscrapping.invoke_site(site['url'])
            status = response.status_code == 200
            # find = str(parsed_response).find("Google")
            self.persist_event(application, 'sites', site['name'], response.status_code, status)
    
    def port_open(self, application, services):
        for service in services:
            port_opened = port_checker.check_port(service['ip'], service['port'])
            self.persist_event(application, 'services', service['name'], port_opened, port_opened)
    
    def database_status(self, application, databases):
        for database in databases:
            result = db_monitor.verify_connection('ODBC Driver 17 for SQL Server', database['ip'], database['database'], database['usr'], database['pwd'])
            self.persist_event(application, 'databases', database['name'], result, result)

    def persist_event(self, application, type, name, status_code, status):
        event = {
            'datetime': datetime.now(),
            'application': application,
            'type': type,
            'name': name,
            'status_code': status_code,
            'status': status
        }
        self.mgo.insert('events', event)


