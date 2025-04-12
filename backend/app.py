from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # for cors without errors


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')
    return jsonify({"received_text": text})


if __name__ == '__main__':
    app.run(debug=True)
