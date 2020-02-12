from flask import Flask, render_template, request, jsonify, json
from modules import importdata


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/main_interface/<id>')
def main_interface(id):
    with open('./modules/data.json','r') as jsonfile:
        file_data = json.loads(jsonfile.read())
    return json.dumps(file_data["CHEMBL325"])

if __name__ == '__main__':
    app.run(debug=True)
    #port = int(os.environ.get('PORT', 5000))
    #app.run(host='0.0.0.0', port=port)