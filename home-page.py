import numpy as np
import joblib

from flask import Flask, request, render_template
# use socketIO to async update the form div
from flask_socketio import SocketIO, emit

app = Flask(__name__, template_folder='code')

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def home():
  return render_template('index.html')

@app.route('/ml-interact')
def ml():
  return render_template('ml-interaction/index.html')

model = joblib.load('ml-models/bi-logistic-reg.pkl')

@app.route('/ml-interact', methods = ['POST'])
@socketio.on('submit') 
def predict():
    
    #obtain all form values and place them in an array, convert into integers
    int_features = [int(x) for x in request.form.values()]
    # #Combine them all into a final numpy array
    final_features = [np.array(int_features)]
    # final_features = [np.array(request.form.values())].reshape(1,-1)
    #predict the price given the values inputted by user
    prediction = model.predict(final_features)
    
    #Get the predicted target result
    output = prediction[0]
    
    #Remember target output mapping: dropout=1, graduate=3
    if output == 1:
        return render_template('ml-interaction/index.html', prediction_text = "Dropout")
    elif output == 3:
        return render_template('ml-interaction/index.html', prediction_text = "Graduate")  


if __name__ == '__main__':
  app.run(debug=True)
