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

def emit_do_work(evt, message):
    print('what:.:::')
    socketio.emit(evt, message, broadcast=True)
    print('what after:.:::')
    
def job():
    print("checking...")
    emit_do_work('start checking', {'data':'event'})
    try:
        crawler.Crawler()
    except mongoerrors.ServerSelectionTimeoutError as mongoError:
        print('>>>! Error to connect to mongodb, please check if database is running before to continue !<<<<')
    emit_do_work('finish checking', {'data':'event'})
    print("finish checking...")
