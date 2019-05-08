import pyodbc

def verify_connection(driver, ip_address, db_name, user, pwd):
    conn_string = "Driver={};Server={};Database={};UID={};PWD={};".format(driver, ip_address, db_name, user, pwd)
    print('conn', conn_string)
    conn = pyodbc.connect(conn_string)
    cursor = conn.cursor()
    cursor.execute("SELECT @@version;") 
    row = cursor.fetchone()
    return row