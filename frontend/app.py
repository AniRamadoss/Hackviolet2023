from flask import Flask, render_template, request, flash
from config import mongo_password
import pymongo


mongoURI = "mongodb+srv://aniramadoss:" + mongo_password + "@cluster0.tlqxqmi.mongodb.net/?retryWrites=true&w=majority"
app = Flask(__name__)
app.secret_key = "manbearpig_MUDMAN888"


from pysentimiento import create_analyzer
hate_speech_analyzer = create_analyzer(task="hate_speech", lang="en")

@app.route("/")
def index():
    flash("Enter the server id and list of banned words")
    return render_template("index.html")


@app.route("/words", methods=['POST', 'GET'])
def greeter():
    banned_words = request.form['banned_words'].split(",")
    print(f'The server id is: {request.form["server_id"]} and the banned words are: {request.form["banned_words"]}')
    insertRecord(request.form["server_id"], request.form["banned_words"])
    return render_template("index.html")

@app.route("/res", methods=['GET'])
def query_ml():
	text = request.args['query']
	res = hate_speech_analyzer.predict(text)
	return res.probas

def insertRecord(serverID, banned_words):
	try:
		client = pymongo.MongoClient(mongoURI)
		db = client["hackviolet2023"]
		collection = db["banned_words"]
		doc = {"serverID": serverID, "banned_words": banned_words}
		result = collection.insert_one(doc)
	except:
		print("Mongo crashed")


