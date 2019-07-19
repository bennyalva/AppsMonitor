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

    def get_stats_by_type(self, type):
        all_points = self.db['points'].find()
        total = 0
        for r in all_points:
            total += len(r[type])
        affected = len(self.db['events'].find({'status': False, 'type': type, 'datetime': {
                       '$gt': datetime.now() - timedelta(hours=24)}}).distinct('application'))
        res = {
            'total': total,
            'affected': affected
        }
        return res

    def get_total_alerts(self):
        all_alerts = self.db['events'].count_documents(
            {'status': False, 'datetime': {'$gt': datetime.now() - timedelta(hours=24)}})
        res = {
            'total': all_alerts
        }
        return res

    def get_affected_apps(self):
        affected = len(self.db['events'].find({'status': False, 'datetime': {
                       '$gt': datetime.now() - timedelta(hours=24)}}).distinct('application'))
        res = {
            'total': affected
        }
        return res

    def get_affected_clients(self):
        last_day = datetime.now() - timedelta(hours=24)
        clients = self.db['events'].find({'status': False, 'datetime': {
            '$gt': last_day}}).distinct('client')
        affected = []
        for c in clients:
            affected.append({
                'client': c,
                'applications': self.db['events'].find({'status': False, 'client': c, 'datetime': {
                    '$gt': last_day}}).distinct('application')
            })
        res = []
        for c in affected:
            cli = {
                'client': c['client']
            }
            apps = []
            for a in c['applications']:
                apps.append({
                    'name': a,
                    'events': self.db['events'].find({'status': False, 'client': c['client'], 'application': a, 'datetime': {
                        '$gt': last_day}})
                })
            cli['applications'] = apps
            res.append(cli)
        return res

    def get_client_affected_types(self):
        last_day = datetime.now() - timedelta(hours=24)
        clients = self.db['events'].find({'status': False, 'datetime': {
            '$gt': last_day}}).distinct('client')
        affected = []
        for c in clients:
            affected.append({
                'client': c,
                'applications': {
                    'total': len(self.db['points'].find({'client': c}).distinct('application')),
                    'affected': len(self.db['events'].find({'status': False, 'client': c, 'datetime': {'$gt': last_day}}).distinct('application'))
                },
                'affected': {
                    'sites': len(self.db['events'].find({'status': False, 'client': c, 'type': 'sites', 'datetime': {'$gt': last_day}}).distinct('name')),
                    'databases': len(self.db['events'].find({'status': False, 'client': c, 'type': 'databases', 'datetime': {'$gt': last_day}}).distinct('name')),
                    'services': len(self.db['events'].find({'status': False, 'client': c, 'type': 'services', 'datetime': {'$gt': last_day}}).distinct('name')),
                    'servicebus': len(self.db['events'].find({'status': False, 'client': c, 'type': 'servicebus', 'datetime': {'$gt': last_day}}).distinct('name'))
                }
            })
        return affected

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

    def upsert(self, collection, data):
        coll = self.db[collection]
        return coll.update_one(data, upsert=True).modified_count

    def init_coll(self, collection, data):
        coll = self.db[collection]
        # TODO: implementar update o insert
        coll.drop()
        return coll.insert_many(data)

    def delete_by_id(self, collection, id):
        coll = self.db[collection]
        return coll.delete_one({'_id': ObjectId(id)}).deleted_count

    def delete(self, collection, query):
        coll = self.db[collection]
        return coll.delete_one(query).deleted_count

    def isBlank(self, myString):
        return not (myString and myString.strip())

    def isNotBlank(self, myString):
        return bool(myString and myString.strip())
