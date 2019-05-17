from flask import Flask, Response, request, render_template, jsonify
from flask_cors import CORS
from bson import Binary, Code
from bson.json_util import dumps
import mongo

app = Flask(__name__)
CORS(app)


def get_response_message(http_status):
    if http_status == 200:
        return 'Operacion realizada con éxito'
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
    res = mgo.get('points', {}, request.args.get('id'),
                  request.args.get('page'), request.args.get('items'))
    return create_response(res, 200)


@app.route('/points/<id>', methods=['PUT'])
def update_point(id):
    mgo = mongo.MongoManager()
    res = mgo.update('points', id, request.get_json())
    return create_response(res, 200)


@app.route('/points/<id>', methods=['DELETE'])
def delete_point(id):
    mgo = mongo.MongoManager()
    res = mgo.delete('points', id)
    return create_response(res, 200)


@app.route('/events', methods=['GET'])
def get_events():
    mgo = mongo.MongoManager()
    res = mgo.get_list('events', {'application': request.args.get('application'), 'type': request.args.get('type')}, request.args.get(
        'startDate'), request.args.get('endDate'), request.args.get('sort'), request.args.get('sortDir'), request.args.get('limit'))
    return create_response(res, 200)


@app.errorhandler(404)
def custom400(error):
    return create_response(None, 404)


@app.errorhandler(500)
def custom400(error):
    return create_response(None, 500)
