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

import os
import re

from sentiment_analysis import analyze

RESOURCES = os.path.join(os.path.dirname(__file__), 'resources')


def test_pos(capsys):
    analyze(os.path.join(RESOURCES, 'pos.txt'))
    out, err = capsys.readouterr()
    score = float(re.search('score of (.+?) with', out).group(1))
    magnitude = float(re.search('magnitude of (.+?)', out).group(1))
    assert score * magnitude > 0


def test_neg(capsys):
    analyze(os.path.join(RESOURCES, 'neg.txt'))
    out, err = capsys.readouterr()
    score = float(re.search('score of (.+?) with', out).group(1))
    magnitude = float(re.search('magnitude of (.+?)', out).group(1))
    assert score * magnitude < 0


def test_mixed(capsys):
    analyze(os.path.join(RESOURCES, 'mixed.txt'))
    out, err = capsys.readouterr()
    score = float(re.search('score of (.+?) with', out).group(1))
    assert score <= 0.3
    assert score >= -0.3


def test_neutral(capsys):
    analyze(os.path.join(RESOURCES, 'neutral.txt'))
    out, err = capsys.readouterr()
    magnitude = float(re.search('magnitude of (.+?)', out).group(1))
    assert magnitude <= 2.0
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
import argparse

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import csv
# [END sentiment_tutorial_import]


# [START def_print_result]
def print_result(annotations):
    score = annotations.document_sentiment.score
    magnitude = annotations.document_sentiment.magnitude

   # for index, sentence in enumerate(annotations.sentences):
    #    sentence_sentiment = sentence.sentiment.score
     #   print('Sentence {} has a sentiment score of {}'.format(
      #      index, sentence_sentiment))

    print('Overall Sentiment: score of {} with magnitude of {}'.format(
        score, magnitude))
    return 0
# [END def_print_result]


# [START def_analyze]
def analyze(movie_review_filename):
    """Run a sentiment analysis request on text within a passed filename."""
    client = language.LanguageServiceClient()

    with open(movie_review_filename, 'r') as review_file:
        # Instantiates a plain text document.
        content = review_file.read()

    document = types.Document(
        content=content,
        type=enums.Document.Type.PLAIN_TEXT)
    annotations = client.analyze_sentiment(document=document)

    # Print the results
    print_result(annotations)
# [END def_analyze]



'''    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        'movie_review_filename',
        help='The filename of the movie review you\'d like to analyze.')
    args = parser.parse_args()
'''
if __name__ == '__main__':
	with open('CSV_NAME.csv', newline='') as csvfile:
		spamreader = csv.DictReader(csvfile, delimiter='|')
		for row in spamreader:
			analyze(row['Message_body'])
			#print(row['Message_body'])
# [END sentiment_tutorial]
