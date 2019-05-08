import mongo

class Crawler:

    def get_points(self):
        return self.mgo.get('points', {})
        
    def __init__(self):
        self.mgo = mongo.MongoManager()
        get_points()

