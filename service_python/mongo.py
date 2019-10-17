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

    def get_stats_by_type(self, type):
        last_day = datetime.now() - timedelta(hours=24)
        newType = '$'+type
        totalTypeByService = self.db['points'].aggregate(
            [
              {
                  '$unwind': {
                              'path': newType
                            }
               }, {
                   '$count': type
                  }
            ]
        )
        listTypeByService = list(totalTypeByService)
        resultTotalByService = 0
        for num in listTypeByService:
            resultTotalByService = num[type]
        totalAffectedByService = self.db['events'].aggregate(
            [
                {
                  '$match': {
                              'status': False, 
                              'type': type,
                              'datetime': {
                                         '$gt': last_day
                                       }
                            }
               }, {
                   '$group': {
                               '_id': '$name'
                             }
                  }, {
                       '$count': 'count'
                     }
            ]
        )
        listAffectedByService = list(totalAffectedByService)
        resultTotalAffectedByService = 0
        for num in listAffectedByService:
            resultTotalAffectedByService = num['count']   
        res = {
            'total': resultTotalByService,
            'affected': resultTotalAffectedByService
        }
        return res
    
    def get_report_by_type(self, type):
        #last day para que nos de los registros del ultimo dia
        #last_day = datetime.now() - timedelta(hours=24)
        report = self.db['reports'].aggregate([
                {
                    '$match': {
                        'status': True, 
                        'type': type
                    }
                }
            ])
        res = {
            'affected': len(list(report))
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

    def get_affected_apps_by_client(self, client):
        #other
        last_day = datetime.now() - timedelta(hours=24)
        affected = self.db['events'].aggregate(
            [
                {
                  '$match': {
                  'status': False, 
                  'datetime': {
                               '$gt': last_day
                              }, 
                  'client': client
                   }
                }, {
                     '$group': {
                                 '_id': {
                                         'client': '$client', 
                                         'application': '$application', 
                                         'type': '$type', 
                                         'name': '$name', 
                                         'status_response': '$status_response'
                                         }, 
                                 'status_response': {
                                                     '$last': '$status_response'
                                                    }, 
                                 'firstDate': {
                                               '$first': '$datetime'
                                              }, 
                                  'lastDate': {
                                               '$last': '$datetime'
                                              }, 
                                  'count': {
                                             '$sum': 1
                                           }
                                 }
                     }, {
                          '$group': {
                                      '_id': '$_id.client', 
                                      'applications': {
                                                       '$push': '$$ROOT'
                                                      }
                                    }
                     }, {
                           '$unwind': {
                                        'path': '$applications'
                                      }
                     }, {
                           '$group': {
                                       '_id': {
                                                'client': '$applications._id.client', 
                                                 'application': '$applications._id.application', 
                                                 'type': '$applications._id.type', 
                                                 'name': '$applications._id.name'
                                              }, 
                                       'errors': {
                                                   '$addToSet': {
                                                                  'status_response': '$applications.status_response', 
                                                                   'firstDate': '$applications.firstDate', 
                                                                    'lastDate': '$applications.lastDate', 
                                                                    'count': '$applications.count'
                                                                }
                                                 }
                                      }
                     }, {
                          '$group': {
                                      '_id': '$_id.client', 
                                       'applications': {
                                                         '$addToSet': '$$ROOT'
                                                        }
                                     }
                         }, {
                               '$sort': {
                                          'applications.errors.lastDate': -1
                                       }
                            }
            ]
        )
        return affected

    def get_affected_clients(self):
        #treehere
        last_day = datetime.now() - timedelta(hours=24)
        res = self.db['events'].aggregate(
           [
              {
                '$match': {
                           'status': False, 
                           'datetime': {
                                         '$gt': last_day
                                       }
                         }
               }, {
                      '$group': {
                                   '_id': {
                                           'client': '$client', 
                                           'application': '$application', 
                                           'type': '$type', 
                                           'name': '$name'
                                          }, 
                                   'last_response': {
                                                        '$last': '$status_response'
                                                    }
                               }
                   }, {
                       '$group': {
                                  '_id': {
                                          'client': '$_id.client', 
                                          'application': '$_id.application'
                                         }, 
                                  'events': {
                                              '$addToSet': {
                                                            'type': '$_id.type', 
                                                            'name': '$_id.name', 
                                                           'last_response': '$last_response'
                                                           }
                                            }
                                }
                        }, {
                             '$group': {
                                        '_id': '$_id.client', 
                                        'applications': {
                                                         '$addToSet': '$$ROOT'
                                                        }
                                      }
                            }, {
                                '$project': {
                                             'applications._id.client': 0
                                            }
                               }
            ])
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
        last_day = datetime.now() - timedelta(hours=24)
        coll = self.db[collection]
        oldNameApplication = coll.find_one({'_id': ObjectId(id)});
        result = self.db['events'].update_many(
                                  {
                                  'client': data['client'],
                                  'application': oldNameApplication['application'],
                                  'datetime':{
                                                '$gt': last_day
                                             }
                                  },
                                   {'$set': {'application':data['application']}}
                        )
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
