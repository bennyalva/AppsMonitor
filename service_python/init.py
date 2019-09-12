from api_routes import app
import cron_task
import config
import sys
import alarm_analizer
import mongo
import json
import pandas as pd
def main():
    cron_task.schedule_job(30)


def init_catalogs():
    json_data = []
    data = pd.read_excel ('hello.xlsx')
    #print('descargar:: ', data)
    with open('catalogs.json') as json_file:
        data = json.load(json_file)
        mgo = mongo.MongoManager()
        mgo.init_coll('catalogs', data)

def init_config():
    json_data = []
    with open('configuration.json') as json_file:
        data = json.load(json_file)
        mgo = mongo.MongoManager()
        mgo.init_coll('configuration', data)

if __name__ == '__main__':
    env = sys.argv[1] if len(sys.argv) == 2 else 'dev'

    if env == 'dev':
        config.env = config.DevelopmentConfig
    elif env == 'prod':
        config.env = config.ProductionConfig

    main()
    init_catalogs()
    app.run(host=config.env.LISTEN_ADDRESS, port=config.env.LISTEN_PORT)
