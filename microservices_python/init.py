from api_routes import app
import cron_task
import config
import sys
import json
#import os as commanLine

#commanLine.system('cd .. && ls')

if __name__ == '__main__':
    env = sys.argv[1] if len(sys.argv) == 2 else 'dev'

    if env == 'dev':
        config.env = config.DevelopmentConfig
    elif env == 'prod':
        config.env = config.ProductionConfig

    app.run(host=config.env.LISTEN_ADDRESS, port=config.env.LISTEN_PORT)
