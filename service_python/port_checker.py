import socket


def check_port(ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex((ip, port))
        if (result == 0):
            return {'status': True, 'msg': 'Status: true'}
        else:
            return {'status': False, 'msg': 'Status: false'}
    except Exception as ex:
        return {'status': False, 'msg': str(ex)}
