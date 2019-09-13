from flask import Flask, Response, request, render_template, jsonify
from flask_cors import CORS
from bson import Binary, Code
from bson.json_util import dumps
import mongo
import config
import crawler

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
    return create_response('pong-n', 200)

@app.route('/check-services', methods=['GET'])
def checkservices():
    #print('request:: ',request.get_json())
    print("checking...")
    crawler.Crawler()
    print("finish checking...")
    return create_response('ok', 200)

@app.errorhandler(404)
def custom400(error):
    return create_response(None, 404)


@app.errorhandler(500)
def custom500(error):
    return create_response(None, 500)
