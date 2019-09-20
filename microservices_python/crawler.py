import mongo
import webscrapping
import port_checker
import db_monitor
import alarm_analizer
from datetime import datetime
import json
from json.encoder import JSONEncoder

class Crawler:
    def __init__(self):
        self.mgo = mongo.MongoManager()
        # self.alm_analizer = alarm_analizer.AlarmAnalizer()
        from api_routes import who
        points = list(self.get_points(who))
        #print('points:: ',points)
        for point in points:
            #print('point:: cakhsvc n',point)
            self.process(point)

    def get_points(self,monitoring):
        return self.mgo.get_list(monitoring)

    def process(self, point):
        #print('databases:: ',point['databases'])
        #print('monitoring_application:', point['application'])
        self.webscrapping(point, point['sites'])
        self.port_open(point, point['services'])
        self.database_status(point, point['databases'])
        
        #print('monitoring_application_finish:', point['application'])

    def webscrapping(self, point, sites):
        for site in sites:
            #print('webscrapping_to:', site['url'])
            result = webscrapping.invoke_site(site['url'])
            # self.alm_analizer.analize(
            #     point, 'sites', site['name'], result['msg'], result['status'])
            #print('webscrapping_to_response:', result)
            self.persist_event(point['client'], point['application'],
                               'sites', site['name'], result['msg'], result['status'])

    def port_open(self, point, services):
        for service in services:
            #print('connecting_to_port:', '{}:{}'.format(
            #    service['ip'], service['port']))
            result = port_checker.check_port(service['ip'], service['port'])
            # self.alm_analizer.analize(
            #     point, 'services', service['name'], result, result)
            #print('connecting_to_port_response:', result)
            self.persist_event(point['client'], point['application'],
                               'services', service['name'], result['msg'], result['status'],
                                point['monitoring'])

    def database_status(self, point, databases):
        for database in databases:
            print('client',point['client'], ' --- databsename:: ', database['name'],'------')
            #print('verifying_dbconnection_to: ', 'type:{} ip:{}, port:{} db:{}'.format(
            #    database['type'], database['ip'], database['port'], database['database']))
            result = db_monitor.verify_connection(
                database['type'], database['ip'], database['port'], database['database'], database['usr'], database['pwd'], database['query'])
            # self.alm_analizer.analize(
            #     point, 'databases', database['name'], result['msg'], result['status'])
            #print('verifying_dbconnection_to_response: ', result)
            self.persist_event(point['client'], point['application'],
                               'databases', database['name'], result['msg'], result['status'],point['monitoring'])

    def persist_event(self, client, application, type, name, status_response, status, monitoring):
        now = datetime.now()
        if status :
            result = self.mgo.update_application_when_true(client, application, type, name)
        print(' result:',status)
        event = {
            'datetime': now,
            'client': client,
            'application': application,
            'type': type,
            'name': name,
            'status_response': status_response,
            'status': status,
            'monitoring':monitoring
            
        }
        self.mgo.insert('events', event)
