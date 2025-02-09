from flask import Flask, render_template

# database
# ...

# flask
app = Flask(__name__, template_folder="resources/flask/templates", static_folder="resources/flask/static")

@app.route("/")
def index():
    return render_template("home.html")

# main
if __name__ == "__main__":
    app.run(port=8000, debug=True)