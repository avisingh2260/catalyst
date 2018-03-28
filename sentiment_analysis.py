# Copyright 2016, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START sentiment_tutorial]
"""Demonstrates how to make a simple call to the Natural Language API."""

# [START sentiment_tutorial_import]
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
import argparse
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import csv
import json
import sys
# [END sentiment_tutorial_import]
maxInt = sys.maxsize
decrement = True

while decrement:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.

    decrement = False
    try:
        csv.field_size_limit(maxInt)
    except OverflowError:
        maxInt = int(maxInt/10)
        decrement = True

# [START def_print_result]
def print_result(annotations):
    score = annotations.document_sentiment.score
    magnitude = annotations.document_sentiment.magnitude

   # for index, sentence in enumerate(annotations.sentences):
    #    sentence_sentiment = sentence.sentiment.score
     #   print('Sentence {} has a sentiment score of {}'.format(
      #      index, sentence_sentiment))

    print('Overall Sentiment: score of {} '.format(
        score))
    return 0
# [END def_print_result]


# [START def_analyze]
def analyze(data):
    """Run a sentiment analysis request on text within a passed filename."""
    client = language.LanguageServiceClient()



    document = types.Document(
        content=data,
        type=enums.Document.Type.PLAIN_TEXT)
    annotations = client.analyze_sentiment(document=document)

    # Print the results
    print_result(annotations)
    return annotations
# [END def_analyze]