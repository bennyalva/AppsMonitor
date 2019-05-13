from pymongo import MongoClient
from bson.objectid import ObjectId


class MongoManager:

    def __init__(self):
        self.client = MongoClient('127.0.0.1:27017')
        self.db = self.client.monitor

    def insert(self, collection, data):
        coll = self.db[collection]
        reg_id = coll.insert_one(data).inserted_id
        return reg_id

    def get_list(self, collection, query):
        coll = self.db[collection]
        r = coll.find(query)
        return list(r)

    def get(self, collection, query, id=None):
        coll = self.db[collection]
        print('id', id)
        if id is not None:
            return coll.find_one({'_id': ObjectId(id)})
        return coll.find()

    def update(self, collection, id, data):
        coll = self.db[collection]
        return coll.update_one({'_id': ObjectId(id)}, {'$set': data}).modified_count

    def delete(self, collection, id):
        coll = self.db[collection]
        return coll.delete_one({'_id': ObjectId(id)}).deleted_count
