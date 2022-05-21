import subprocess
from flask import Flask, jsonify

app = Flask(__name__)

# Route for flush data from django database
@app.route('/django/flush-data', methods=['GET'])
def flush_data():
    result = subprocess.run(['bash', './flush.sh'])
    if result.returncode == 0:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False}), 500

# Route for load data from django database
@app.route('/django/load-data', methods=['GET'])
def load_data():
    result = subprocess.run(['bash', './load.sh'])
    if result.returncode == 0:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False}), 500
