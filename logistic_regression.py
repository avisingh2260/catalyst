from google.cloud import bigtable
import csv

TABLE_NAME = 'clientSentimentTable'
COLUMN_FAMILY_NAME = 'sentimentData'

client = bigtable.Client(project='serious-azimuth-140706', admin=True)
instance = client.instance('codegrind')
table = instance.table(TABLE_NAME)
column_client_id = 'clientid'.encode('utf-8')
column_age = 'age'.encode('utf-8')
column_sex = 'gender'.encode('utf-8')
column_no_call = 'noOfCalls'.encode('utf-8')
column_no_visit = 'noOfVisits'.encode('utf-8')
column_pos = 'Positive'.encode('utf-8')
column_neg = 'Negative'.encode('utf-8')
column_exit = 'exit'.encode('utf-8')
partial_rows = table.read_rows()
partial_rows.consume_all()
download_dir = "CodeGrind_Catalyst_SampleData.csv" #where you want the file to be downloaded to 

csv = open(download_dir, "w") 
#"w" indicates that you're writing strings to the file

columnTitleRow = "CLIENT_ID, AGE, SEX, NO_CALL, NO_VISIT, POSITIVE, NEGATIVE, EXIT\n"
csv.write(columnTitleRow)
for row_key, row in partial_rows.rows.items():
    key = row_key.decode('utf-8')
    cell_column_client_id = row.cells[COLUMN_FAMILY_NAME][column_client_id][0]
    cell_column_age = row.cells[COLUMN_FAMILY_NAME][column_age][0]
    cell_column_sex = row.cells[COLUMN_FAMILY_NAME][column_sex][0]
    cell_column_no_call = row.cells[COLUMN_FAMILY_NAME][column_no_call][0]
    cell_column_no_visit = row.cells[COLUMN_FAMILY_NAME][column_no_visit][0]
    cell_column_pos = row.cells[COLUMN_FAMILY_NAME][column_pos][0]
    cell_column_neg = row.cells[COLUMN_FAMILY_NAME][column_neg][0]
    cell_column_exit = row.cells[COLUMN_FAMILY_NAME][column_exit][0]

    value_cell_column_client_id = cell_column_client_id.value.decode('utf-8')
    value_cell_column_age = cell_column_age.value.decode('utf-8')
    value_cell_column_sex = cell_column_sex.value.decode('utf-8')
    value_cell_column_no_call = cell_column_no_call.value.decode('utf-8')
    value_cell_column_no_visit = cell_column_no_visit.value.decode('utf-8')
    value_cell_column_pos = cell_column_pos.value.decode('utf-8')
    value_cell_column_neg = cell_column_neg.value.decode('utf-8')
    value_cell_column_exit = cell_column_exit.value.decode('utf-8')

    row = value_cell_column_client_id + "," + value_cell_column_age + "," + value_cell_column_sex + "," + value_cell_column_no_call + "," + value_cell_column_no_visit + "," + value_cell_column_pos + "," + value_cell_column_neg + "," + value_cell_column_exit +"\n"
    csv.write(row)
csv.close()
import numpy as np
import pandas as pd
# Importing the dataset
dataset = pd.read_csv('CodeGrind_Catalyst_SampleData.csv')
print(dataset.columns)
X=dataset[[' AGE',' SEX',' NO_CALL',' NO_VISIT',' POSITIVE',' NEGATIVE']]
y=dataset[[' EXIT']]

# Splitting the dataset into the Training set and Test set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.01, random_state = 0)

# Fitting Logistic Regression to the Training set
from sklearn.linear_model import LogisticRegression
classifier = LogisticRegression(random_state = 0)
classifier.fit(X_train, y_train)
print(classifier.coef_)
print(classifier.intercept_)
REGRESSION_TABLE_NAME = 'regressionModelValue'
REGRESSION_COLUMN_FAMILY_NAME = 'regressionValuesFamily'

regression_client = bigtable.Client(project='serious-azimuth-140706', admin=True)
regression_instance = client.instance('codegrind')
regression_table = regression_instance.table(REGRESSION_TABLE_NAME)
column_id_age = 'age'.encode('utf-8')
column_id_sex = 'gender'.encode('utf-8')
column_id_noOfVisits = 'noOfVisits'.encode('utf-8')
column_id_noOfCalls = 'noOfCalls'.encode('utf-8')
column_id_Positive = 'Positive'.encode('utf-8')
column_id_Negative = 'Negative'.encode('utf-8')
column_id_intercept = 'intercept'.encode('utf-8')
#row_key = sender_id.Sender_id
row = regression_table.row('regressionValues')
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_age,
    str(classifier.coef_[0][0]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_sex,
    str(classifier.coef_[0][1]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_noOfCalls,
    str(classifier.coef_[0][2]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_noOfVisits,
    str(classifier.coef_[0][3]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_Positive,
    str(classifier.coef_[0][4]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_Negative,
    str(classifier.coef_[0][5]))
row.set_cell(
    REGRESSION_COLUMN_FAMILY_NAME,
    column_id_intercept,
    str(classifier.intercept_[0]))
row.commit()