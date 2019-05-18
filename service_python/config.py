env = {}
class Config:
    APP_NAME = 'myapp'

class DevelopmentConfig(Config):
    DEBUG = True
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = '127.0.0.1'

class ProductionConfig(Config):
    DEBUG = False
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = 'mongodb'