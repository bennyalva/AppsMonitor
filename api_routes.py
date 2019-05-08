from flask import Flask, Response, json, request
from flask_cors import CORS
import mongo

app = Flask(__name__)
CORS(app)

def create_response(data, http_status):
    return Response(
        response=json.dumps(data),
        status=http_status,
        mimetype='application/json')

@app.route('/tests', methods=['GET'])
def test():
    return create_response('Prueba', 200)

@app.route('/points', methods=['POST'])
def insert_point():
    mgo = mongo.MongoManager()
    mgo.insert('points', request.get_json())
    return create_response('', 200)