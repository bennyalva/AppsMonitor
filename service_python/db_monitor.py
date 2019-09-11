from contextlib import contextmanager
import jaydebeapi
import json
import sys


#def verify_connection(type, ip_address, port, db_name, user, pwd):
def verify_connection(type, ip_address, port, db_name, user, pwd, query):
    try:
        with open_db_connection(type, ip_address, port, db_name, user, pwd) as cursor:
            #query = 'SELECT 1 FROM DUAL' if type == 'oracle' else 'SELECT 1'
            cursor.execute(query)
            row = cursor.fetchone()
            #print('row:: ',row)
            #return {'status': True, 'msg': row[0]}
            return {'status': True, 'msg': row}
    except Exception as ex:
        return {'status': False, 'msg': str(ex)}


@contextmanager
def open_db_connection(type, ip_address, port, db_name, user, pwd):
    if type == 'oracle':
        driverClassName = 'oracle.jdbc.driver.OracleDriver'
        connection_string = 'jdbc:oracle:thin:@{}:{}:{}'.format(
            ip_address, port, db_name)
    if type == 'sqlserver':
        driverClassName = 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
        connection_string = 'jdbc:sqlserver://{}:{};DatabaseName={};User={};Password={}'.format(
            ip_address, port, db_name, user, pwd)
    if type == 'mysql':
        driverClassName = 'com.mysql.cj.jdbc.Driver'
        connection_string = 'jdbc:mysql://{}:{}/{}?sslMode=DISABLED&useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC'.format(
            ip_address, port, db_name)

    #print('verifying_connection_to_conn: ', connection_string)
    driverPath = ['drivers/sqljdbc42.jar', 'drivers/ojdbc8.jar',
                  'drivers/mysql-connector-java-8.0.16.jar']
    connection = jaydebeapi.connect(driverClassName,
                                    connection_string,
                                    [user, pwd],
                                    driverPath)

    cursor = connection.cursor()
    try:
        yield cursor
    except Exception as err:
        print(err)
        raise err
    finally:
        connection.close()
        cursor.close()
        del cursor
        del connection
