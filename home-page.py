import numpy as np
import joblib
import sys
import pandas as pd
import csv

from flask import Flask, request, render_template, send_file

app = Flask(__name__, template_folder='testing')

@app.route('/get_data')
def give_d3_data():
  return send_file('data.csv')

@app.route('/get_data_comma')
def give_d3_data_comma():
  return send_file('data-comma.csv')

@app.route('/')
def home():
  return render_template('walkthrough.html')

@app.route('/ml-interact')
def ml():
  return render_template('ml-interaction/index.html')

@app.route('/pp-plot')
def pp_plot():
  return render_template('parallel.html')

@app.route('/bubble-plot')
def bubble():
  return render_template('bubble.html')

model = joblib.load('ml-models/nn-reg')

@app.route('/ml-interact', methods = ['POST'])
def predict():
    
    # obtain all form values and place them in an array, convert into integers
    int_features = [int(x) for x in request.form.values()]
    # combine them all into a final numpy array
    final_features = [np.array(int_features)]
    # predict the price given the values inputted by user
    prediction = model.predict(final_features)
    
    # get the predicted target result
    output = prediction[0]
    
    # remember target output mapping: dropout=1, graduate=3
    if output == 1:
        return render_template('ml-interaction/index.html', prediction_text = "Dropout")
    elif output == 2:
        return render_template('ml-interaction/index.html', prediction_text = "Enrolled (too early to say)")
    elif output == 3:
        return render_template('ml-interaction/index.html', prediction_text = "Graduate")  


if __name__ == '__main__':
  app.run(debug=True)
