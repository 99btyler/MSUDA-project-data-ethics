from sqlalchemy import create_engine, text

import pandas as pd

# Define the SQLHelper Class
# PURPOSE: Deal with all of the database logic

class SQLHelper():

    # Initialize PARAMETERS/VARIABLES
    #################################################################
    # Database Setup
    #################################################################

    def __init__(self):
        #self.engine = create_engine("sqlite:///us_tornado.sqlite")
        self.engine = create_engine("sqlite:///C:/Users/neela/Documents/BootCamp_2024/Project 3/APP/us_tornado.sqlite")

    #################################################################

    def queryBarData1(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                    month, 
                    COUNT(*) AS tornado_count
                FROM 
                    us_tornado
                GROUP BY 
                    month
                ORDER BY 
                    tornado_count DESC;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)

    def queryBarData2(self):
    # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

    # Define Query
        query = text("""SELECT 
                            year,
                            sum(fatalities) AS 'Total_Fatalities'
                        FROM 
                            us_tornado
                        GROUP BY
                            year;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    def queryBarData3(self):
    # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

    # Define Query
        query = text("""SELECT 
                            state, 
                            COUNT(*) AS tornado_count 
                        FROM 
                            us_tornado 
                        GROUP BY 
                            state 
                        ORDER BY 
                            tornado_count desc
                        LIMIT 20;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    

    def queryPieChartData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                            month, COUNT(*) AS tornado_count
                        FROM 
                            us_tornado
                        WHERE 
                            year = 2021 and state = 'TX'
                        GROUP BY 
                            month;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    def queryTableData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(""" SELECT 
                            year, 
                            tornado_magnitude,
                            start_latitude,
                            start_longitude,
                            state
                        FROM 
                            us_tornado 
                        GROUP BY 
                            year 
                        ORDER BY 
                            year asc;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    def queryMapData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = (""" SELECT 
                        year, 
                        tornado_magnitude,
                        start_latitude,
                        start_longitude,
                        state
                    FROM 
                        us_tornado ;""")
        df = pd.read_sql(query, con=conn)

    #Close the connection
        conn.close()
        return(df)





