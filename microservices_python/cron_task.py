from threading import Thread
import schedule
import time
import crawler


def schedule_job(every_minutes):
    schedule.every(every_minutes).minutes.do(job)
    t = Thread(target=run_schedule)
    t.start()


def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)


def job():
    print("checking ")
    crawler.Crawler()
    print("finish checking ")
