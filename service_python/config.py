env = {}
class Config:
    APP_NAME = 'AppMonitor'

class DevelopmentConfig(Config):
    DEBUG = True
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = '10.11.0.123'
    EMAIL_HOST = 'smtp.office365.com'
    EMAIL_PORT = 0
    EMAIL_USER = ''
    EMAIL_PWD = ''

class ProductionConfig(Config):
    DEBUG = False
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = 'mongodb'
    #MONGO_URL = '10.11.5.213'
    EMAIL_HOST = 'smtp.office365.com'
    EMAIL_PORT = 0
    EMAIL_USER = ''
    EMAIL_PWD = ''
