from flask import Flask, render_template, request, flash

app = Flask(__name__)
app.secret_key = "manbearpig_MUDMAN888"


@app.route("/")
def index():
    flash("Enter the server id and list of banned words")
    return render_template("index.html")


@app.route("/words", methods=['POST', 'GET'])
def greeter():
    banned_words = request.form['banned_words'].split(",")
    # print(banned_words)
    print(
        f'The server id is: {request.form["sever_id"]} and the banned words are: {request.form["banned_words"]}')

    return render_template("index.html")
