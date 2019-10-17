from api_routes import app, socketio
import cron_task
import config
import sys
import alarm_analizer
import mongo
import json
import pandas as pd
from pymongo import errors as mongoerrors

def main():
    cron_task.schedule_job(1)


def init_catalogs():
    data = pd.read_excel ('hello.xlsx')
    #print('descargar:: ', data)
    with open('catalogs.json') as json_file:
        data = json.load(json_file)
        mgo = mongo.MongoManager()
        mgo.init_coll('catalogs', data)

def init_config():
    with open('configuration.json') as json_file:
        data = json.load(json_file)
        mgo = mongo.MongoManager()
        mgo.init_coll('configuration', data)

#método para cargar el mock data a mongo
def initMock():
    with open('./json_data/closing_report.json') as closing:
        data = json.load(closing)
        mgo = mongo.MongoManager()
        mgo.init_coll('reports',data)
    
if __name__ == '__main__':
    env = sys.argv[1] if len(sys.argv) == 2 else 'dev'

    if env == 'dev':
        config.env = config.DevelopmentConfig
    elif env == 'prod':
        config.env = config.ProductionConfig
    try:
        main()
        initMock()
        init_catalogs()
    except mongoerrors.ServerSelectionTimeoutError as mongoError:
        print('>>>! Error to connect to mongodb, please check if database is running before to start !<<<<') 
    #app.run(host=config.env.LISTEN_ADDRESS, port=config.env.LISTEN_PORT)
    socketio.run(app,host=config.env.LISTEN_ADDRESS, port=config.env.LISTEN_PORT)
