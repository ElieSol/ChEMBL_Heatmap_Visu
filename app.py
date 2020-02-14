
#
# Main server side script 
# Author: Julie Solacroup
# Last modified: 14/02/2020  
# 
import sys
sys.path.append("modules")
from importdata import get_data
from flask import Flask, render_template, request, jsonify, json



app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/data')
def data():
    return jsonify(get_data())

if __name__ == '__main__':
    app.run(debug=True)