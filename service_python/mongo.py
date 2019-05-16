from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import dateutil.parser


class MongoManager:

    def __init__(self):
        self.client = MongoClient('127.0.0.1:27017')
        self.db = self.client.monitor

    def insert(self, collection, data):
        coll = self.db[collection]
        reg_id = coll.insert_one(data).inserted_id
        return reg_id

    def get_list(self, collection, query, startDate=None, endDate=None):
        coll = self.db[collection]

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
            return list(coll.find(query))

        r = coll.find(query)
        return list(r)

    def get(self, collection, query, id=None, page=None, items=None):
        coll = self.db[collection]
        print('id', id)
        if id is not None:
            return coll.find_one({'_id': ObjectId(id)})
        if page is not None and items is not None:
            skip = int(page) * int(items)
            limit = int(items)
            res = { 'total': coll.find().count(), 'items': coll.find().skip(skip).limit(limit) }
            return res
        return coll.find()

    def update(self, collection, id, data):
        coll = self.db[collection]
        return coll.update_one({'_id': ObjectId(id)}, {'$set': data}).modified_count

    def delete(self, collection, id):
        coll = self.db[collection]
        return coll.delete_one({'_id': ObjectId(id)}).deleted_count

    def isBlank(self, myString):
        return not (myString and myString.strip())

    def isNotBlank(self, myString):
        return bool(myString and myString.strip())
