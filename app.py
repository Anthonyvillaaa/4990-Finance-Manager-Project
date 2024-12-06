from flask import Flask, request, jsonify
from flask_cors import CORS
from Final_Project import contact_openai_api

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Prepopulate the data for testing
income_data = [
#     {"source": ["Job Salary"], "amount": [3000], "frequency": ["Monthly"]},
#     {"source": ["Freelance Work"], "amount": [500], "frequency": ["Weekly"]},
]

expense_data = [
#     {
#         "category": ["Rent"],
#         "amount": [1200],
#         "frequency": ["Monthly"],
#         "description": ["Apartment rent"],
#     },
#     {
#         "category": ["Groceries"],
#         "amount": [300],
#         "frequency": ["Weekly"],
#         "description": ["Food and household items"],
#     },
]

goals_data = [
#     {"goal-name": ["Vacation Fund"], "target-amount": [5000], "deadline": ["2025-12-31"]},
#     {"goal-name": ["Emergency Savings"], "target-amount": [10000], "deadline": ["2025-06-30"]},
]

@app.route('/')
def hello():
    return "Hello, World!"

# Route to handle income submissions
@app.route('/submit-income', methods=['POST'])
def submit_income():
    data = request.json  # Parse JSON data sent from frontend
    if not data:
        return jsonify({"error": "No data received"}), 400
    income_data.append(data)  # Add data to storage


    return jsonify({"message": "Income data saved successfully!"}), 200

# Route to handle expense submissions
@app.route('/submit-expense', methods=['POST'])
def submit_expense():
    data = request.json  # Parse JSON data sent from frontend
    if not data:
        return jsonify({"error": "No data received"}), 400
    expense_data.append(data)  # Add data to storage
    return jsonify({"message": "Expense data saved successfully!"}), 200

# Route to handle goals submissions
@app.route('/submit-goals', methods=['POST'])
def submit_goals():
    data = request.json  # Parse JSON data from frontend
    if not data:
        return jsonify({"error": "No data received"}), 400
    goals_data.append(data)
    return jsonify({"message": "Goals data saved successfully!", "data": goals_data}), 200

# Route to get all data (for summary or debugging)
@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({"income": income_data, "expenses": expense_data, "goals": goals_data}), 200

@app.route('/analyze-finances', methods=['POST'])
def analyze_finances():
    analysis = contact_openai_api(income_data, expense_data, goals_data)

    # Ensure the analysis is returned as JSON
    if "error" in analysis:
        return jsonify({"message": "Error in financial analysis", "analysis": analysis}), 500

    return jsonify(analysis), 200



if __name__ == '__main__':
    app.run(debug=True)
