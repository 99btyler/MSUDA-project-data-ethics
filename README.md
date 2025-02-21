# MSUDA-project-data-ethics
MSU Data Analytics Project 3

# Executive Summary
### Project Purpose
Explore historical tornado events using [this dataset found on Kaggle](https://www.kaggle.com/datasets/danbraswell/us-tornado-dataset-1950-2021)
### Project Structure
#### Backend
From the .csv file, we create an sqlite3 database
* [ERD](submission/analysis/database/ERD.jpg)
* [database-setup.ipynb](submission/analysis/database/database-setup.ipynb)
* [test-visualizations.ipynb](submission/analysis/database/test-visualizations.ipynb)

We then create a Flask backend for pages and routes
* [app.py](submission/analysis/app/app.py) which uses [sqlHelper.py](submission/analysis/app/sqlHelper.py)
#### Frontend
Pages are created to display the data insights
* [Flask templates folder](submission/analysis/app/templates)
* [Flask static folder](submission/analysis/app/static)
### Ethical Considerations
Kaggle is a well-trusted source for datasets, and all of the data used in the project is publically available
