from threading import Thread
from api_routes import socketio
import schedule
import time
import crawler
from pymongo import errors as mongoerrors


def schedule_job(every_minutes):
    schedule.every(every_minutes).minutes.do(job)
    t = Thread(target=run_schedule)
    t.start()


def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)


def job():
    print("checking...")
    socketio.emit('startChecking', {'data':'event'}, broadcast=True)
    socketio.emit('newReport',{'data': 'event'}, broadcast=True)
    try:
        crawler.Crawler()
    except mongoerrors.ServerSelectionTimeoutError as mongoError:
        print('>>>! Error to connect to mongodb, please check if database is running before to continue !<<<<')
    socketio.emit('finishChecking', { 'data':'event'}, broadcast=True)
    print("finish checking...")
