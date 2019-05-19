import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import config

class Notifications:

    # pylint: disable=maybe-no-member
    def __init__(self):
        self.s = smtplib.SMTP(host=config.env.EMAIL_HOST, port=config.env.EMAIL_PORT)
        self.s.ehlo()
        self.s.starttls()
        self.s.login(config.env.EMAIL_USER, config.env.EMAIL_PWD)

    # pylint: disable=maybe-no-member
    def send_email(self, dest, body):
        try:
            msg = MIMEMultipart()
            msg['From']=config.env.EMAIL_USER
            msg['To']=", ".join(dest) 
            msg['Subject']="Alertas Axity"
            msg.attach(MIMEText(body, 'plain'))
            self.s.sendmail(config.env.EMAIL_USER, dest, msg.as_string())
        finally:
            del msg
            self.s.quit
        