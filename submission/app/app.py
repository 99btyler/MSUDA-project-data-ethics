from flask import Flask, jsonify, render_template
import sqlite3

# flask
app = Flask(__name__)

# flask API
@app.route("/api/v1.0/bar-chart-1")
def bar_data1():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT month, COUNT(*) as tornado_count
                        FROM tornadoes
                        GROUP BY month
                        ORDER BY tornado_count DESC
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/bar-chart-2")
def bar_data2():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT year, sum(fatalities) AS 'Total_Fatalities'
                        FROM tornadoes
                        GROUP BY year
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/bar-chart-3")
def bar_data3():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT state, COUNT(*) AS tornado_count 
                        FROM tornadoes 
                        GROUP BY state 
                        ORDER BY tornado_count DESC
                        LIMIT 20
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/pie-chart")
def pie_chart():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT month, COUNT(*) AS tornado_count
                        FROM tornadoes
                        WHERE year = 2021 and state = 'TX'
                        GROUP BY month
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/table")
def table():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT year, tornado_magnitude, start_latitude, start_longitude, state
                        FROM tornadoes
                        ORDER BY year ASC
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/map")
def map_data():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT year, tornado_magnitude, start_latitude, start_longitude, state
                        FROM tornadoes
                        ORDER BY year ASC
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

# flask pages
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# main
if __name__ == "__main__":
    app.run(port=8000, debug=True)