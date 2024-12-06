from openai import OpenAI
import json
from datetime import datetime

def contact_openai_api(income_data, expense_data, goals_data):
	income_Information = ""
	expense_Information = ""
	goals_Information = ""
	current_date = datetime.now().strftime("%Y-%m-%d")


	income_Information = "\n".join(
		[f"Source: {data['source'][i]}, Amount: {data['amount'][i]}, Frequency: {data['frequency'][i]}" 
		for data in income_data for i in range(len(data['source']))]
	)
	expense_Information = "\n".join(
		[f"Category: {data['category'][i]}, Amount: {data['amount'][i]}, Frequency: {data['frequency'][i]}, Description: {data['description'][i]}" 
		for data in expense_data for i in range(len(data['category']))]
	)
	goals_Information = "\n".join(
		[f"Goal: {data['goal-name'][i]}, Target Amount: {data['target-amount'][i]}, Deadline: {data['deadline'][i]}" 
		for data in goals_data for i in range(len(data['goal-name']))]
	)

	print(income_Information+"\n"+expense_Information+"\n"+goals_Information)

	# Format the prompt for the API
# Format the prompt for the API
	prompt = f"""
	You are a financial advisor. Based on the following financial data:
	Current Date: {current_date}

	Income:
	{income_Information}

	Expenses:
	{expense_Information}

	Goals:
	{goals_Information}

	Provide a financial analysis in JSON format with the following structure:
	{{
	"budget_summary": {{
	"total_income": "Total income value",
	"total_expenses": "Total expenses value",
	"remaining_balance": "Remaining balance value"
	}},
	"expense_breakdown": [
	{{
	"category": "Category name",
	"amount": "Amount value",
	"frequency": "Frequency value"
	}}
	],
	"savings_suggestions": [
	"Suggestion 1",
	"Suggestion 2",
	"Suggestion 3"
	],
	"goals_achievement_plan": [
	{{
	"goal_name": "Name of the goal",
	"target_amount": "Target amount value",
	"deadline": "Deadline value",
	"monthly_contribution_needed": "Amount to save monthly (must be a number)",
	"feasibility": "Achievable/Unachievable",
	"action_plan": "Detailed steps to meet the goal"
	}}
	]
	}}

	Strictly return valid JSON without any extra text or comments. If the input data is invalid or insufficient, respond with an error in this format:
	{{
	"error": "Error message describing the issue"
	}}
	"""



	client = OpenAI(
		api_key="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"
	)

	completion = client.chat.completions.create(
		model="gpt-4o-mini",
		messages=[
			{"role": "system", "content": "You are a financial advisor."},
			{
				"role": "user",
				"content": prompt,
			}
		]
	)

	response_content = completion.choices[0].message.content.strip()

	# Log the raw response for debugging
	print("Raw OpenAI Response:", response_content)

	# Validate and parse JSON
	try:
		financial_summary = json.loads(response_content)  # Ensure valid JSON response
		return financial_summary
	except json.JSONDecodeError:
		# Handle invalid JSON gracefully
		return {
		"error": "Invalid JSON response from OpenAI",
		"raw_response": response_content
		}
