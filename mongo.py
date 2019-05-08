from pymongo import MongoClient

class MongoManager:

    def __init__(self):
        self.client = MongoClient('127.0.0.1:27017')
        self.db = self.client.monitor


    def insert(self):
        col_config = self.db.config
        reg = {'name':'Javier'}
        reg_id = col_config.insert_one(reg).inserted_id
        return reg_id

        

