from flask import Flask, Response, json, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def create_response(data, http_status):
    return Response(
        response=json.dumps(data),
        status=http_status,
        mimetype='application/json')

@app.route('/test', methods=['GET'])
def test():
    return create_response('Prueba', 200)