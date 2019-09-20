from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta, date
import dateutil.parser
import config
import json

class MongoManager:

    def __init__(self):
        self.client = MongoClient('{}:27017'.format(
            config.env.MONGO_URL))  # pylint: disable=maybe-no-member
        self.db = self.client.monitor
    def get_list(self,monitoring):
        coll = self.db['points'].aggregate(
                [
                    {
                      '$match': {
                                  'monitoring': monitoring
                                }
                    }
                ])
        return coll
        if startDate is not None or endDate is not None:
            dateFilter = {'datetime': {}}
            if self.isNotBlank(startDate):
                dateFilter['datetime'] = {
                    '$gte': dateutil.parser.parse(startDate)
                }

            if self.isNotBlank(endDate):
                dateFilter['datetime'] = dict(dateFilter['datetime'], **{
                    '$lte': dateutil.parser.parse(endDate)
                })

            query.update(dateFilter)

            print('filter', query)

        if sort is not None and limit is not None:
            return coll.find(query).sort(sort, -1 if sortDir == 'desc' else 1).limit(int(limit))
        elif sort is not None:
            return coll.find(query).sort(sort, -1 if sortDir == 'desc' else 1)
        elif limit is not None:
            return coll.find(query).limit(int(limit))

        return coll.find(query)

    def insert(self, collection, data):
        coll = self.db[collection]
        reg_id = coll.insert_one(data).inserted_id
        return reg_id

    def update_application_when_true(self,client, application, type, name):
         last_day = datetime.now() - timedelta(hours=24)
         result = self.db['events'].update_many(
                                  {
                                  'client': client,
                                  'application': application,
                                  'type':type,
                                  'name':name,
                                  'datetime':{
                                                '$gt': last_day
                                             }
                                  },
                                   {'$set': {'status':True}}
                        )
        
         return True

    def findAllPoints(self):
        return self.db['points'].find()
        
    def isBlank(self, myString):
        return not (myString and myString.strip())

    def isNotBlank(self, myString):
        return bool(myString and myString.strip())
