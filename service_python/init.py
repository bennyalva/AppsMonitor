from api_routes import app
import cron_task
import config
import sys

def main():
    cron_task.schedule_job(5)
    # n = notification_controller.Notifications()
    # emails = ['francisco.rodriguez@axity.com']
    # body = 'Prueba'
    # n.send_email(emails, body)

if __name__ == '__main__':
    env = sys.argv[1] if len(sys.argv) == 2 else 'dev'

    if env == 'dev':
        config.env = config.DevelopmentConfig
    elif env == 'prod':
        config.env = config.ProductionConfig

    main()
    app.run(host=config.env.LISTEN_ADDRESS, port=config.env.LISTEN_PORT)