from flask import Flask, request, jsonify, json



app = Flask(__name__)
@app.route('/main_interface/<id>')
def main_interface(id):
    with open('./modules/data.json','r') as jsonfile:
        file_data = json.loads(jsonfile.read())
    return json.dumps(file_data["CHEMBL325"])

if __name__ == '__main__':
    app.run(debug=True)