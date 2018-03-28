import numpy as np
#import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import r2_score
import math
# Importing the dataset
dataset = pd.read_excel('C:\\Users\\Inspiron\\Desktop\\Google-Cloud\\Complaints_Reasons_New.xlsx')
X=dataset['Complaint']
y=dataset['Reason']
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.15, random_state = 0)

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.ensemble import RandomForestClassifier

from sklearn.pipeline import Pipeline

text_clf = Pipeline([('vect', CountVectorizer()), ('tfidf', TfidfTransformer()), ('clf',RandomForestClassifier(n_estimators = 400, random_state = 0))])

text_clf = text_clf.fit(X_train, y_train)
predicted = text_clf.predict(X_test)
np.mean(predicted == y_test)