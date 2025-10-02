from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Loads the HTML file

@app.route('/predict', methods=['POST'])
def predict():
    emp_id = request.form['emp_id']
    target = float(request.form['target'])
    sales = float(request.form['sales'])

    # Simple prediction logic
    if sales >= target:
        performance = "Top Performer"
    elif sales >= 0.75 * target:
        performance = "Average"
    else:
        performance = "Needs Improvement"

    return f"Employee {emp_id} is categorized as: {performance}"

if __name__ == '__main__':
    app.run(debug=True)
