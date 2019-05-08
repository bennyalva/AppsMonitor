from threading import Thread
import schedule
import time
import crawler

def schedule_job():
    schedule.every(1).seconds.do(job)
    t = Thread(target=run_schedule)
    t.start()

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)

def job():
    print("I'm working...")
    crawler.Crawler()