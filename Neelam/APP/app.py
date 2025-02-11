import pandas as pd
from flask import Flask, jsonify, render_template, redirect, request
from sqlHelper import SQLHelper


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # remove caching

# SQL Helper
sqlHelper = SQLHelper()


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    
    return (
        render_template("index.html")

    )

@app.route("/api/v1.0/bar_data1")
def bar_data1():
    # Execute queries
    df = sqlHelper.queryBarData1()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/bar_data2")
def bar_data2():
    # Execute queries
    df = sqlHelper.queryBarData2()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/bar_data3")
def bar_data3():
    # Execute queries
    df = sqlHelper.queryBarData3()

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

@app.route("/api/v1.0/table")
def table():
    # Execute Query
    df = sqlHelper.queryTableData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/map_data")
def map_data():
    # Execute Query
    df = sqlHelper.queryMapData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


#############################################################

# ELIMINATE CACHING
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#############################################################

if __name__ == '__main__':
    app.run(debug=True)
