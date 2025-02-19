from flask import Flask, jsonify, render_template
import pandas as pd
import sqlite3
from sqlHelper import SQLHelper

app = Flask(__name__)
sqlHelper = SQLHelper()

# Flask API
@app.route("/api/v1.0/table")
def table():
    with sqlite3.connect("../database/data/database.db") as connection:
        cursor = connection.cursor()

        cursor.execute(
                        """
                        SELECT year, state, SUM(fatalities) AS num_of_fatalities, SUM(injuries) AS num_of_injuries, COUNT(*) AS num_of_tornadoes
                        FROM tornado
                        GROUP BY year, state;
                        """
        )

        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()

        data = [dict(zip(columns,row)) for row in rows]
        return jsonify(data)

@app.route("/api/v1.0/linechart_data")
def linechart_data():
    # Execute Query
    df = sqlHelper.queryLineChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/bubblechart_data")
def bubblechart_data():
    # Execute Query
    df = sqlHelper.queryBubbleChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/time_series")
def timeSeries_data():
    # Execute queries
    df = sqlHelper.queryTimeSeriesData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/scatter_data")
def scatter_data():
    # Execute queries
    df = sqlHelper.queryScatterChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/pie_chart")
def pie_chart():
    # Execute Query
    df = sqlHelper.queryPieChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/map")
def map_data():
    # Execute Query
    df = sqlHelper.queryMapData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

# Flask pages
@app.route("/")
def home():
    return render_template("pages/home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("pages/dashboard.html")

@app.route("/dashboard1")
def dashboard1():
    return render_template("dashboard1.html")

@app.route("/dashboard2")
def dashboard2():
    return render_template("dashboard2.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about")
def about():
    return render_template("pages/about.html")

@app.route("/sources")
def sources():
    return render_template("pages/sources.html")

# main
if __name__ == "__main__":
    app.run(debug=True)
