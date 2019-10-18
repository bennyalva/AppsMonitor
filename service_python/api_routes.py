from flask import Flask, Response, request, render_template, jsonify
from flask_cors import CORS
from bson import Binary, Code
from bson.json_util import dumps
import mongo
from flask_socketio import SocketIO, emit
#import eventlet
#eventlet.monkey_patch()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", use_reloader=False)

@socketio.on('connect')
def test_connect():
    print('someone connected')
    socketio.emit('after connect',  {'welcome':'pharmacyMonitoring'})
    
def get_response_message(http_status):
    if http_status == 200:
        return 'Operacion realizada con exito'
    elif http_status == 404:
        return 'No encontrado'
    else:
        return 'Ocurrió un error en el servidor'


def create_response(data, http_status):
    json_response = {'message': get_response_message(
        http_status), 'data': data}
    return Response(
        response=dumps(json_response),
        status=http_status,
        mimetype='application/json')


@app.route('/ping', methods=['GET'])
def ping():
    return create_response('pong', 200)


@app.route('/points', methods=['POST'])
def insert_point():
    mgo = mongo.MongoManager()
    res = mgo.insert('points', request.get_json())
    return create_response(res, 200)


@app.route('/points', methods=['GET'])
def get_points():
    mgo = mongo.MongoManager()
    res = mgo.get_single('points', {
        'client': request.args.get('client'),
        'application': request.args.get('application')
    })
    return create_response(res, 200)


@app.route('/points/<id>', methods=['PUT'])
def update_point(id):
    mgo = mongo.MongoManager()
    res = mgo.update('points', request.get_json(), id)
    return create_response(res, 200)

@app.route('/points', methods=['DELETE'])
def delete_point():
    mgo = mongo.MongoManager()
    res = mgo.delete('points', {
        'client': request.args.get('client'),
        'application': request.args.get('application')
    })
    return create_response(res, 200)


@app.route('/events', methods=['GET'])
def get_events():
    mgo = mongo.MongoManager()
    res = mgo.get_list('events', {'application': request.args.get('application'), 'type': request.args.get('type')}, request.args.get(
        'startDate'), request.args.get('endDate'), request.args.get('sort'), request.args.get('sortDir'), request.args.get('limit'))
    return create_response(res, 200)


@app.route('/catalogs', methods=['GET'])
def get_catalogs():
    mgo = mongo.MongoManager()
    res = mgo.get_list('catalogs', {})
    return create_response(res, 200)


@app.route('/clients', methods=['POST'])
def insert_client():
    mgo = mongo.MongoManager()
    res = mgo.insert('clients', request.get_json())
    return create_response(res, 200)


@app.route('/clients', methods=['GET'])
def get_clients():
    mgo = mongo.MongoManager()
    res = mgo.get('clients', {}, request.args.get('id'),
                  request.args.get('page'), request.args.get('items'))
    return create_response(res, 200)


@app.route('/clients/apps', methods=['GET'])
def get_clients_apps():
    mgo = mongo.MongoManager()
    res = mgo.get_clients_with_points()
    return create_response(res, 200)


@app.route('/clients/events', methods=['GET'])
def get_clients_apps_events():
    mgo = mongo.MongoManager()
    res = mgo.get_clients_with_points_and_events()
    return create_response(res, 200)


@app.route('/clients/raw', methods=['GET'])
def get_clients_raw():
    mgo = mongo.MongoManager()
    res = mgo.get_clients()
    return create_response(res, 200)


@app.route('/clients/<id>', methods=['PUT'])
def update_client(id):
    mgo = mongo.MongoManager()
    res = mgo.update('clients', request.get_json(), id)
    return create_response(res, 200)


@app.route('/clients/<id>', methods=['DELETE'])
def delete_client(id):
    mgo = mongo.MongoManager()
    res = mgo.delete_by_id('clients', id)
    return create_response(res, 200)


@app.route('/dashboard/stats/<type>', methods=['GET'])
def get_type_stats(type):
    mgo = mongo.MongoManager()
    res = mgo.get_stats_by_type(type)
    return create_response(res, 200)


@app.route('/dashboard/stats/alerts', methods=['GET'])
def get_total_alerts():
    mgo = mongo.MongoManager()
    res = mgo.get_total_alerts()
    return create_response(res, 200)


@app.route('/dashboard/stats/affected-apps', methods=['GET'])
def get_affected_apps():
    mgo = mongo.MongoManager()
    res = mgo.get_affected_apps()
    return create_response(res, 200)


@app.route('/dashboard/stats/affected-clients', methods=['GET'])
def get_affected_clients():
    mgo = mongo.MongoManager()
    res = mgo.get_affected_clients()
    return create_response(res, 200)


@app.route('/dashboard/stats/client-affected-types', methods=['GET'])
def get_client_affected_types():
    mgo = mongo.MongoManager()
    res = mgo.get_client_affected_types()
    return create_response(res, 200)


@app.route('/dashboard/stats/affected-apps-client/<client>', methods=['GET'])
def get_affected_apps_by_client(client):
    mgo = mongo.MongoManager()
    res = mgo.get_affected_apps_by_client(client)
    return create_response(res, 200)

@app.route('/reports/report/<type>', methods=['GET'])
def get_type_report(type):
    mgo = mongo.MongoManager()
    res = mgo.get_report_by_type(type,False)
    return create_response(res, 200)

@app.route('/reports/report/detail/<type>', methods=['GET'])
def get_type_report_detail(type):
    mgo = mongo.MongoManager()
    res = mgo.get_report_by_type(type,True)
    return create_response(res, 200)

@app.route('/reports/report/<report>', methods=['PUT'])
def delete_report(report):
    mgo = mongo.MongoManager()
    mgo.update_by_id('reports',report)
    return create_response("ok", 200)

@app.route('/api/reports', methods=['POST'])
def api_reports():
    mgo = mongo.MongoManager()
    #res = mgo.insert('clients', request.get_json())
    mgo.insert_many_to_collection('reports', request.get_json())
    socketio.emit('newReport',{'data': 'event'}, broadcast=True)
    return create_response(True, 200)

@app.errorhandler(404)
def custom400(error):
    return create_response(None, 404)


@app.errorhandler(500)
def custom500(error):
    return create_response(None, 500)
