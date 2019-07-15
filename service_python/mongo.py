from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import dateutil.parser
import config


class MongoManager:

    def __init__(self):
        self.client = MongoClient('{}:27017'.format(
            config.env.MONGO_URL))  # pylint: disable=maybe-no-member
        self.db = self.client.monitor

    def insert(self, collection, data):
        coll = self.db[collection]
        reg_id = coll.insert_one(data).inserted_id
        return reg_id

    def get_list(self, collection, query, startDate=None, endDate=None, sort=None, sortDir=None, limit=None):
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

        if sort is not None and limit is not None:
            return coll.find(query).sort(sort, -1 if sortDir == 'desc' else 1).limit(int(limit))
        elif sort is not None:
            return coll.find(query).sort(sort, -1 if sortDir == 'desc' else 1)
        elif limit is not None:
            return coll.find(query).limit(int(limit))

        return coll.find(query)

    def get(self, collection, query, id=None, page=None, items=None):
        coll = self.db[collection]
        if id is not None:
            return coll.find_one({'_id': ObjectId(id)})
        if page is not None and items is not None:
            skip = int(page) * int(items)
            limit = int(items)
            res = {'total': coll.find().count(
            ), 'items': coll.find().skip(skip).limit(limit)}
            return res
        return coll.find()

    def get_single(self, collection, query):
        coll = self.db[collection]
        return coll.find_one(query)

    def get_clients_with_points(self):
        coll = self.db['points']
        pipeline = [
            {
                '$group': {
                    '_id': {
                        'client': '$client',
                        'application': '$application'
                    },
                    'databases': {
                        '$sum': {
                            '$size': '$databases'
                        }
                    },
                    'sites': {
                        '$sum': {
                            '$size': '$sites'
                        }
                    },
                    'services': {
                        '$sum': {
                            '$size': '$services'
                        }
                    },
                    'servicebus': {
                        '$sum': {
                            '$size': '$servicebus'
                        }
                    },
                    'administrators': {
                        '$sum': {
                            '$size': '$ownerEmail'
                        }
                    }
                }
            }, {
                '$group': {
                    '_id': {
                        'client': '$_id.client'
                    },
                    'applications': {
                        '$push': {
                            'application': '$_id.application',
                            'databases': '$databases',
                            'sites': '$sites',
                            'services': '$services',
                            'servicebus': '$services',
                            'administrators': '$administrators'
                        }
                    }
                }
            }
        ]
        return coll.aggregate(pipeline)

    def get_clients_with_points_and_events(self):
        coll = self.db['points']
        pipeline = [
            {
                '$group': {
                    '_id': {
                        'client': '$client',
                        'application': '$application',
                        'applicationId': '$_id'
                    },
                    'databases': {
                        '$addToSet': {
                            '$mergeObjects': '$databases'
                        }
                    },
                    'sites': {
                        '$addToSet': {
                            '$mergeObjects': '$sites'
                        }
                    },
                    'services': {
                        '$addToSet': {
                            '$mergeObjects': '$services'
                        }
                    },
                    'servicebus': {
                        '$addToSet': {
                            '$mergeObjects': '$servicebus'
                        }
                    },
                    'administrators': {
                        '$addToSet': {
                            '$mergeObjects': '$ownerEmail'
                        }
                    }
                }
            }, {
                '$project': {
                    '_id': '$_id',
                    'databases': {
                        '$filter': {
                            'input': '$databases',
                            'as': 'item',
                            'cond': {
                                '$gt': [
                                    '$$item', {}
                                ]
                            }
                        }
                    },
                    'sites': {
                        '$filter': {
                            'input': '$sites',
                            'as': 'item',
                            'cond': {
                                '$gt': [
                                    '$$item', {}
                                ]
                            }
                        }
                    },
                    'services': {
                        '$filter': {
                            'input': '$services',
                            'as': 'item',
                            'cond': {
                                '$gt': [
                                    '$$item', {}
                                ]
                            }
                        }
                    },
                    'servicebus': {
                        '$filter': {
                            'input': '$servicebus',
                            'as': 'item',
                            'cond': {
                                '$gt': [
                                    '$$item', {}
                                ]
                            }
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'events',
                    'localField': '_id.applicationId',
                    'foreignField': 'application',
                    'as': 'events'
                }
            }, {
                '$group': {
                    '_id': {
                        'client': '$_id.client'
                    },
                    'applications': {
                        '$push': {
                            'application': {
                                'application': '$_id.application',
                                'applicationId': '$_id.applicationId'
                            },
                            'databases': '$databases',
                            'sites': '$sites',
                            'services': '$services',
                            'servicebus': '$services',
                            'administrators': '$administrators',
                            'events': {
                                '$filter': {
                                    'input': '$events',
                                    'as': 'evt',
                                    'cond': {
                                        '$gt': [
                                            '$$evt.datetime', datetime.now() - timedelta(hours=24)
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                '$project': {
                    '_id': '$_id',
                    'applications': {
                        '$filter': {
                            'input': '$applications',
                            'as': 'app',
                            'cond': {
                                '$gt': [
                                    {
                                        '$size': '$$app.events'
                                    }, 0
                                ]
                            }
                        }
                    }
                }
            }, {
                '$match': {
                    '$expr': {
                        '$gt': [
                            {
                                '$size': '$applications'
                            }, 0
                        ]
                    }
                }
            }
        ]
        # '$$evt.datetime', datetime.now() - timedelta(hours=24)
        return coll.aggregate(pipeline)

    def get_clients(self):
        coll = self.db['points']
        pipeline = [
            {
                '$group': {
                    '_id': {
                        'client': '$client'
                    }
                }
            }
        ]
        return coll.aggregate(pipeline)

    def update(self, collection, data, id):
        coll = self.db[collection]
        return coll.update_one({'_id': ObjectId(id)}, {'$set': data}).modified_count

    def init_coll(self, collection, data):
        coll = self.db[collection]
        # TODO: implementar update o insert
        coll.drop()
        return coll.insert_many(data)

    def delete(self, collection, id):
        coll = self.db[collection]
        return coll.delete_one({'_id': ObjectId(id)}).deleted_count

    def delete(self, collection, query):
        coll = self.db[collection]
        return coll.delete_one(query).deleted_count

    def isBlank(self, myString):
        return not (myString and myString.strip())

    def isNotBlank(self, myString):
        return bool(myString and myString.strip())
