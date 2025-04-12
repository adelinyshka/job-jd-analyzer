from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # for cors without errors


@app.route('/', methods=['GET'])
def home():
    return "Hello from Flask!"


if __name__ == '__main__':
    app.run(debug=True)
