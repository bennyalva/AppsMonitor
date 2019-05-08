from flask import Flask, Response, request
from flask_cors import CORS
from bson import Binary, Code
from bson.json_util import dumps
import mongo

app = Flask(__name__)
CORS(app)


def create_response(data, http_status):
    return Response(
        response=dumps(data),
        status=http_status,
        mimetype='application/json')


@app.route('/ping', methods=['GET'])
def ping():
    return create_response('pong', 200)


@app.route('/points', methods=['POST'])
def insert_point():
    mgo = mongo.MongoManager()
    mgo.insert('points', request.get_json())
    return create_response('', 200)


@app.route('/points', methods=['GET'])
def get_points():
    mgo = mongo.MongoManager()
    res = mgo.get('points', {})
    return create_response(res, 200)
