import pyodbc
import json

def verify_connection(driver, ip_address, db_name, user, pwd):
    try:
        conn_string = "Driver={};Server={};Database={};UID={};PWD={};".format(driver, ip_address, db_name, user, pwd)
        print('verifying_connection_to_conn: ', conn_string)
        conn = pyodbc.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute("SELECT @@version;") 
        row = cursor.fetchone()
        return {'status': True, 'msg': row[0]}
    except pyodbc.Error as ex:
        return {'status': False, 'msg': ex}
        