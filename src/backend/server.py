from flask import Flask
from flask_cors import cross_origin

app = Flask(__name__)

@app.route("/ping")
@cross_origin()
def ping():
    return("Ping")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)