# ecs163-team-10
ECS 163 final project for team 10. Winter Quarter 2024

# Directories and notable files
- ```ml-interaction``` directory contains the HTML file for hosting the front end of machine learning model
- ```ml-models``` directory is for hosting the machine learning models themselves that will be imported into the website. `ml-notebooks.ipynb` holds the code that generated these models and the static visuals.
- ```home-page.py``` is the server file.
- The `src` directory contains all html files used to host interactive visualizations, namely `parallel.html` and `bubble.html`

# Running the website
In order to run it, make sure to download `flask` via `pip install flask` and Scikit-Learn version 1.2.2 via `pip install -U scikit-learn`, which requires Python 3.8 or newer (if you don't have that version, please go to https://www.python.org/ to download the latest version). After downloading this repository, open the terminal, go into the repository root folder and input the command `python -m flask --app home-page run` or `flask --app home-page run`.

# Plots and Interaction
Our two interactive visualizations are a bubble plot and a parallel coordinates plot. The bubble plot implements zooming and also shows a tooltip with more information when hovering over a bubble. The parallel coordinates plot implements brushing on each individual axis. Furthermore, clicking on an axis label reveals a histogram subplot for that axis alongside some additional information.

Additionally, we have a user interface for interacting with a machine learning model that predicts whether a student will drop out based on the selected input values.
