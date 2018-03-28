import pickle
filename = 'finalized_model.sav'

text=["very poor credit card service"]


loaded_model = pickle.load(open(filename, 'rb'))
result = loaded_model.predict(text)
print(result[0])