
'''
Before running this script, the user should get the authentication by following 
the link: https://developers.google.com/gmail/api/quickstart/python
Also, client_secret.json should be saved in the same directory as this file
'''

# Importing required libraries
from apiclient import discovery
from apiclient import errors
from httplib2 import Http
from oauth2client import file, client, tools
import base64
from bs4 import BeautifulSoup
import re
import time
import dateutil.parser as parser
from datetime import datetime
import datetime
import csv
import json
import argparse
import math
from sentiment_analysis import analyze
from google.cloud import bigtable
def getEmail(sender_id):
    SCOPES = 'https://www.googleapis.com/auth/gmail.readonly'
    CLIENT_SECRET_FILE = 'client_secret.json'
    APPLICATION_NAME = 'Gmail API Python Quickstart'
    store = file.Storage('storage.json') 
    creds = store.get()
    TABLE_NAME = 'clientSentimentTable'
    COLUMN_FAMILY_NAME = 'sentimentData'

    client = bigtable.Client(project='serious-azimuth-140706', admin=True)
    instance = client.instance('codegrind')
    table = instance.table(TABLE_NAME)
    total_neg=0
    total_pos=0
    i=0
    last_sentiment=0
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
        creds = tools.run_flow(flow, store)
    GMAIL = discovery.build('gmail', 'v1', http=creds.authorize(Http()))

    user_id =  'me'
    label_id_one = 'INBOX'

    # Getting all the unread messages from Inbox
    # labelIds can be changed accordingly
    
    query="from:"+sender_id.Sender_id
    msgs = GMAIL.users().messages().list(userId='me',labelIds=[label_id_one], q=query).execute()

    # We get a dictonary. Now reading values for the key 'messages'
    mssg_list = msgs['messages']

    print ("Total messages in inbox: ", str(len(mssg_list)))

    final_list = [ ]


    for mssg in mssg_list:
        temp_dict = { }
        m_id = mssg['id']    # get id of individual message
        message = GMAIL.users().messages().get(userId=user_id, id=m_id ).execute() # fetch the message using API
        payld = message['payload'] # get payload of the message 
        headr = payld['headers'] # get header of the payload


        for one in headr: # getting the Subject
            if one['name'] == 'Subject':
                msg_subject = one['value']
                temp_dict['Subject'] = msg_subject
            else:
                pass

        for three in headr: # getting the Sender
            if three['name'] == 'From':
                msg_from = three['value']
                temp_dict['Sender'] = msg_from
            else:
                pass

        temp_dict['Snippet'] = message['snippet'] # fetching message snippet

        

        try:
            
            # Fetching message body
            mssg_parts = payld['parts'] # fetching the message parts
            part_one  = mssg_parts[0] # fetching first element of the part 
            part_body = part_one['body'] # fetching body of the message
            part_data = part_body['data'] # fetching data from the body
            clean_one = part_data.replace("-","+") # decoding from Base64 to UTF-8
            clean_one = clean_one.replace("_","/") # decoding from Base64 to UTF-8
            clean_two = base64.b64decode (bytes(clean_one, 'UTF-8')) # decoding from Base64 to UTF-8
            soup = BeautifulSoup(clean_two , "lxml" )
            mssg_body = soup.body()
            # mssg_body is a readible form of message body
            # depending on the end user's requirements, it can be further cleaned 
            # using regex, beautiful soup, or any other method
            temp_dict['Message_body'] = mssg_body
            current_sentiment=analyze(str(temp_dict['Message_body'])).document_sentiment.score
            if current_sentiment < 0:
                total_neg=total_neg+1
            else:
                total_pos=total_pos+1
            if i==0:
                last_sentiment=current_sentiment
            i=i+1
        except :
            pass

        final_list.append(temp_dict) # This will create a dictonary item in the final list
        # This will mark the messagea as read
        
        


    print(last_sentiment)
    print ("Total messaged retrived: ", str(len(final_list)))
    print('Total Negative is {}'.format(total_neg));
    print('Total Positive is {}'.format(total_pos));
    # [START getting_a_row]
    value_neg = str(total_neg)
    value_pos = str(total_pos)    
    last_sentiment_val=str(last_sentiment)
    column_id_neg = 'Negative'.encode('utf-8')
    column_id_pos = 'Positive'.encode('utf-8')
    column_id_last_sentiment = 'lastSentiment'.encode('utf-8')
    column_id_last_probability = 'Probability'.encode('utf-8')
    row_key = sender_id.Sender_id
   
    column_age = 'age'.encode('utf-8')
    column_sex = 'gender'.encode('utf-8')
    column_no_call = 'noOfCalls'.encode('utf-8')
    column_no_visit = 'noOfVisits'.encode('utf-8')
    column_pos = 'Positive'.encode('utf-8')
    column_neg = 'Negative'.encode('utf-8')
    row_client = table.read_row(row_key.encode('utf-8'))
    age = row_client.cells[COLUMN_FAMILY_NAME][column_age][0].value.decode('utf-8')
    sex = row_client.cells[COLUMN_FAMILY_NAME][column_sex][0].value.decode('utf-8')
    no_call = row_client.cells[COLUMN_FAMILY_NAME][column_no_call][0].value.decode('utf-8')
    no_visit = row_client.cells[COLUMN_FAMILY_NAME][column_no_visit][0].value.decode('utf-8')
    pos = row_client.cells[COLUMN_FAMILY_NAME][column_pos][0].value.decode('utf-8')
    neg = row_client.cells[COLUMN_FAMILY_NAME][column_neg][0].value.decode('utf-8')
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
    row_coeff = regression_table.read_row('regressionValues'.encode('utf-8'))
    age_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_age][0].value.decode('utf-8')
    sex_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_sex][0].value.decode('utf-8')
    no_call_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_noOfCalls][0].value.decode('utf-8')
    no_visit_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_noOfVisits][0].value.decode('utf-8')
    pos_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_Positive][0].value.decode('utf-8')
    neg_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_Negative][0].value.decode('utf-8')
    intercept_coeff = row_coeff.cells[REGRESSION_COLUMN_FAMILY_NAME][column_id_intercept][0].value.decode('utf-8')
    intercept_final = float(intercept_coeff)
    age_final = float(age_coeff)*float(age)
    sex_final = float(sex_coeff)*float(sex)
    no_call_final = float(no_call_coeff)*float(no_call)
    no_visit_final = float(no_visit_coeff)*float(no_visit)
    pos_final = float(pos_coeff)*float(value_pos)
    neg_final = float(neg_coeff)*float(value_neg)
    expression = intercept_final+age_final+sex_final+no_call_final+no_visit_final+pos_final+neg_final
    prob=1/(1+math.exp(-(expression)))
    print(prob);
    row = table.row(row_key)
    row.set_cell(
       COLUMN_FAMILY_NAME,
       column_id_neg,
       value_neg.encode('utf-8'))
    row.set_cell(
       COLUMN_FAMILY_NAME,
       column_id_pos,
       value_pos.encode('utf-8'))
    row.set_cell(
       COLUMN_FAMILY_NAME,
       column_id_last_sentiment,
       last_sentiment_val.encode('utf-8'))
    row.set_cell(
       COLUMN_FAMILY_NAME,
       column_id_last_probability,
       str(prob).encode('utf-8'))   
    row.commit()
'''
The final_list will have dictionary in the following format:
{    'Sender': '"email.com" <name@email.com>', 
    'Subject': 'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet', 
    'Date': 'yyyy-mm-dd', 
    'Snippet': 'Lorem ipsum dolor sit amet'
    'Message_body': 'Lorem ipsum dolor sit amet'}
The dictionary can be exported as a .csv or into a databse
'''

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
    description=__doc__,
    formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
    'Sender_id',
    help='The ID of the sender you would like to analyze.')
    args = parser.parse_args()
    getEmail(args)
'''        
with open('outputfile.json', 'w') as fout:
    json.dump(str(final_list), fout)
'''