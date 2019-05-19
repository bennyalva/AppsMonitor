import mongo
import notification_controller

class AlarmAnalizer:
    
    def __init__(self):
        self.mgo = mongo.MongoManager()
        self.notification = notification_controller.Notifications()

    def analize(self, application, type, name, status_response, status):
        event = { 'application': application,
                'type': type,
                'name': name }
        if(status == False):
            similar_alarms = list(self.mgo.get_list('events', event, sort='datetime', sortDir='desc', limit=1))
            print('similar_alarms False', similar_alarms)
            if len(similar_alarms) >= 1 & similar_alarms[0]['status'] == False:
                print('Mando mail se cayo')
                print('Dest', self.get_dest_alarms(event))
                print('Msg', self.create_alarm_message(False, event, status_response))
                self.notification.send_email(self.get_dest_alarms(event), self.create_alarm_message(False, event, status_response))
        else:
            similar_alarms = list(self.mgo.get_list('events', event, sort='datetime', sortDir='desc', limit=2))
            print('similar_alarms True', similar_alarms)
            print('Filter', list(filter(lambda sim_alm: sim_alm['status'] == False, similar_alarms)))
            if(len(similar_alarms) >= 2 & len(list(filter(lambda sim_alm: sim_alm['status'] == False, similar_alarms))) == 2):
                print('Mando mail levanto')
                print('Dest', self.get_dest_alarms(event))
                print('Msg', self.create_alarm_message(True, event, status_response))
                self.notification.send_email(self.get_dest_alarms(event), self.create_alarm_message(True, event, status_response))
        print('Termine')
    
    def create_alarm_message(self, status, event, status_response):
        MAIL_CONTENT = ''
        if status == False:
            MAIL_CONTENT = ''' Buen día,
            El sistema {} - {} se encuentra abajo, 
            la respuesta obtenida fue: {}'''.format(event['application'], event['name'], status_response)
        else:
            MAIL_CONTENT = ''' Buen día,
            El sistema {} - {} regreso a su estado normal'''.format(event['application'], event['name'])
        return MAIL_CONTENT

    def get_dest_alarms(self, event):
        recipients = list(self.mgo.get('points', event))
        mails = []
        #TODO: Wacala, cambiar estos horrendos for por lambda como este intento:
        #mails = list(map(lambda recipt: recipt['ownerEmail'], recipients))
        for recipt in recipients:
            for owner in recipt['ownerEmail']:
                mails.append(owner)
        return mails