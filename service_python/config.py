env = {}
class Config:
    APP_NAME = 'myapp'

class DevelopmentConfig(Config):
    DEBUG = True
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = '127.0.0.1'
    EMAIL_HOST = 'smtp.office365.com'
    EMAIL_PORT = 587
    EMAIL_USER = 'arquitectura.swd@axity.com'
    EMAIL_PWD = '4xSoft&2019'

class ProductionConfig(Config):
    DEBUG = False
    LISTEN_PORT = 3000
    LISTEN_ADDRESS = '0.0.0.0'
    MONGO_URL = 'mongodb'
    EMAIL_HOST = 'smtp.office365.com'
    EMAIL_PORT = 587
    EMAIL_USER = 'arquitectura.swd@axity.com'
    EMAIL_PWD = '4xSoft&2019'