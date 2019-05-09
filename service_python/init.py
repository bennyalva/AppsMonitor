from api_routes import app
import crawler
import cron_task

def main():
    cron_task.schedule_job()
    # crawler.Crawler()

if __name__ == '__main__':
    main()
    app.run(host='0.0.0.0', port=3000)