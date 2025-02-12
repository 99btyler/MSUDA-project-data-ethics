from flask import Flask, render_template, jsonify
import sqlite3

# flask
app = Flask(__name__, template_folder="resources/flask/templates", static_folder="resources/flask/static")

# flask API
@app.route("/api/test_content") # TODO: remove this test content
def get_test_content():
    with sqlite3.connect("resources/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM tornadoes ORDER BY RANDOM() LIMIT 5")

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

# flask pages
@app.route("/")
def index():
    return render_template("home.html")

# main
if __name__ == "__main__":
    app.run(port=8000, debug=True)