from flask import Flask, Response, request, render_template, jsonify
from flask_cors import CORS
from bson import Binary, Code
from bson.json_util import dumps
import mongo
import config
import crawler

app = Flask(__name__)
CORS(app)
who = 0

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

@app.route('/newiam', methods=['POST'])
def newiam():
    newWho = request.get_json('name')
    global who
    who = newWho['name']
    print('what have:: ', who)
    return create_response(who, 200)

@app.route('/whoiam', methods=['GET'])
def whoiam():
    return create_response(who, 200)


@app.errorhandler(404)
def custom400(error):
    return create_response(None, 404)


@app.errorhandler(500)
def custom500(error):
    return create_response(None, 500)
