from google.cloud import bigtable
import argparse

TABLE_NAME = 'clientSentimentTable'
COLUMN_FAMILY_NAME = 'sentimentData'

client = bigtable.Client(project='serious-azimuth-140706', admin=True)
instance = client.instance('codegrind')
table = instance.table(TABLE_NAME)
# [START getting_a_row]


row = table.row('magsworldz@gmail.com')
row.set_cell(
    COLUMN_FAMILY_NAME,
    'exit',
    '0')
row.commit()
row = table.row('nikshah41@gmail.com')
row.set_cell(
    COLUMN_FAMILY_NAME,
    'exit',
    '0')
row.commit()
row = table.row('10047@gmail.com')
row.set_cell(
    COLUMN_FAMILY_NAME,
    'exit',
    '1')
row.commit()	
row = table.row('10046@gmail.com')
row.set_cell(
    COLUMN_FAMILY_NAME,
    'exit',
    '1')
row.commit()
row = table.row('10045@gmail.com')
row.set_cell(
    COLUMN_FAMILY_NAME,
    'exit',
    '1')
row.commit()