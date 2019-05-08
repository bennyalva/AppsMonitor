from pymongo import MongoClient

class MongoManager:

    def __init__(self):
        self.client = MongoClient('127.0.0.1:27017')
        self.db = self.client.monitor


    def insert(self, collection, data):
        coll = self.db[collection]
        reg_id = coll.insert_one(data).inserted_id
        return reg_id
    
    def get(self, collection, query):
        coll = self.db[collection]
        return coll.find(query)