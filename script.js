// script.js

// Handle Income Form
const incomeForm = document.getElementById('income-form');
const addIncomeButton = document.getElementById('add-income');

addIncomeButton.addEventListener('click', () => {
	const newIncomeGroup = document.createElement('div');
	newIncomeGroup.className = 'income-group';
	newIncomeGroup.innerHTML = `
		<input type="text" name="source" placeholder="Income Source" required>
		<input type="number" name="amount" placeholder="Amount" required>
		<select name="frequency" required>
			<option value="">Frequency</option>
			<option value="Daily">Daily</option>
			<option value="Weekly">Weekly</option>
			<option value="Bi-Weekly">Bi-Weekly</option>
			<option value="Monthly">Monthly</option>
			<option value="Annually">Annually</option>
			<option value="One-Time">One-Time</option>
		</select>
		<button class="remove-button" id="delete">&times;</button>
	`;
	incomeForm.insertBefore(newIncomeGroup, addIncomeButton);

	newIncomeGroup.querySelector('#delete').addEventListener('click', () => {
		incomeForm.removeChild(newIncomeGroup);
	});
});

incomeForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(incomeForm);
	const incomeData = {};
	formData.forEach((value, key) => {
		if (!incomeData[key]) {
		  incomeData[key] = []; // Initialize an array for each key
		}
		incomeData[key].push(value); // Push new entries to the array
	      });

	try {
		const response = await fetch('http://127.0.0.1:5000/submit-income', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(incomeData),
		});
		const result = await response.json();
		console.log(result);

		alert('Income submitted to the server!');
	} catch (error) {
		console.error('Error submitting income:', error);
	}
});

// Handle Expense Form
const expenseForm = document.getElementById('expense-form');
const addExpenseButton = document.getElementById('add-expense');

addExpenseButton.addEventListener('click', () => {
	const newExpenseGroup = document.createElement('div');
	newExpenseGroup.className = 'expense-group';
	newExpenseGroup.innerHTML = `
		<select name="category" required>
			<option value="">Select Category</option>
			<option value="Rent">Rent</option>
			<option value="Groceries">Groceries</option>
			<option value="Utilities">Utilities</option>
			<option value="Transportation">Transportation</option>
		</select>
		<input type="number" name="amount" placeholder="Amount" required>
		<select name="frequency" required>
			<option value="">Frequency</option>
			<option value="Daily">Daily</option>
			<option value="Weekly">Weekly</option>
			<option value="Bi-Weekly">Bi-Weekly</option>
			<option value="Monthly">Monthly</option>
			<option value="Annually">Annually</option>
			<option value="One-Time">One-Time</option>
		</select>
		<input type="text" name="description" placeholder="Description (Optional)">
		<button class="remove-button" id="delete">&times;</button>
	`;
	expenseForm.insertBefore(newExpenseGroup, addExpenseButton);

	newExpenseGroup.querySelector('#delete').addEventListener('click', () => {
		expenseForm.removeChild(newExpenseGroup);
	});
});

expenseForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(expenseForm);
	const expenseData = {};
	formData.forEach((value, key) => {
		if (!expenseData[key]) {
			expenseData[key] = [];
		}
		expenseData[key].push(value);
	});

	try {
		const response = await fetch('http://127.0.0.1:5000/submit-expense', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(expenseData),
		});
		const result = await response.json();
		console.log(result);
		alert('Expense submitted to the server!');
	} catch (error) {
		console.error('Error submitting expense:', error);
	}
});

// Handle Goals Form
const goalsForm = document.getElementById('goals-form');
const addGoalButton = document.getElementById('add-goal');

addGoalButton.addEventListener('click', () => {
	const newGoalGroup = document.createElement('div');
	newGoalGroup.className = 'goal-group';
	newGoalGroup.innerHTML = `
		<input type="text" name="goal-name" placeholder="Goal Name" required>
		<input type="number" name="target-amount" placeholder="Target Amount" required>
		<input type="date" name="deadline" placeholder="Deadline" required>
		<button class="remove-button" id="delete">&times;</button>
	`;
	goalsForm.insertBefore(newGoalGroup, addGoalButton);

	newGoalGroup.querySelector('#delete').addEventListener('click', () => {
		goalsForm.removeChild(newGoalGroup);
	});
});

goalsForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(goalsForm);
	const goalsData = {};
	
	formData.forEach((value, key) => {
		if (!goalsData[key]) {
		  goalsData[key] = []; // Initialize an array for each key
		}
		goalsData[key].push(value); // Push new entries to the array
	      });

	try {
		const response = await fetch('http://127.0.0.1:5000/submit-goals', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(goalsData),
		});
		const result = await response.json();
		console.log(result);
		alert('Goals submitted to the server!');
	} catch (error) {
		console.error('Error submitting goals:', error);
	}
});

const analyzeButton = document.getElementById('analyze-button');

// Helper functions for rendering data
function renderBudgetSummary(data) {
  const budgetSummary = data.budget_summary;
  return `
    <table>
      <tr>
        <th>Category</th>
        <th>Amount</th>
      </tr>
      <tr>
        <td>Total Income</td>
        <td>$${budgetSummary.total_income}</td>
      </tr>
      <tr>
        <td>Total Expenses</td>
        <td>$${budgetSummary.total_expenses}</td>
      </tr>
      <tr>
        <td>Remaining Balance</td>
        <td>$${budgetSummary.remaining_balance}</td>
      </tr>
    </table>
  `;
}

function renderExpenseBreakdown(data) {
  const expenseBreakdown = data.expense_breakdown;
  const rows = expenseBreakdown.map(expense => `
    <tr>
      <td>${expense.category}</td>
      <td>$${expense.amount}</td>
      <td>${expense.frequency}</td>
    </tr>
  `).join('');

  return `
    <table>
      <tr>
        <th>Category</th>
        <th>Amount</th>
        <th>Frequency</th>
      </tr>
      ${rows}
    </table>
  `;
}

function renderSavingsSuggestions(data) {
  const suggestions = data.savings_suggestions;
  const listItems = suggestions.map(suggestion => `<li>${suggestion}</li>`).join('');

  return `<ul>${listItems}</ul>`;
}

function renderExpenseChart(data) {
  const expenseBreakdown = data.expense_breakdown;
  const categories = expenseBreakdown.map(expense => expense.category);
  const amounts = expenseBreakdown.map(expense => expense.amount);

  const ctx = document.getElementById('expenseChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Expenses',
        data: amounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Main button click event
analyzeButton.addEventListener('click', async () => {
	try {
	  const response = await fetch('http://127.0.0.1:5000/analyze-finances', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	  });
	  const result = await response.json();
      
	  if (response.status !== 200 || result.error) {
	    throw new Error(result.error || 'Failed to fetch analysis');
	  }
      
	  console.log('API Response:', result);
      
	  // Render Budget Summary
	  const budgetSummary = result.budget_summary;
	  document.getElementById('budget-summary').innerHTML = `
	    <tr><td>Total Income</td><td>$${budgetSummary.total_income}</td></tr>
	    <tr><td>Total Expenses</td><td>$${budgetSummary.total_expenses}</td></tr>
	    <tr><td>Remaining Balance</td><td>$${budgetSummary.remaining_balance}</td></tr>
	  `;
      
	  // Render Expense Breakdown
	  const expenseBreakdown = result.expense_breakdown;
	  document.getElementById('expense-breakdown').innerHTML = expenseBreakdown.map(expense => `
	    <tr>
	      <td>${expense.category}</td>
	      <td>$${expense.amount}</td>
	      <td>${expense.frequency}</td>
	    </tr>
	  `).join('');
      
	  // Render Savings Suggestions
	  const savingsSuggestions = result.savings_suggestions;
	  document.getElementById('savings-suggestions').innerHTML = savingsSuggestions.map(suggestion => `
	    <li>${suggestion}</li>
	  `).join('');
      
	  // Render the Pie Chart
	  renderPieChart(result);
      
	  // Render Goals Achievement Plan
	  document.getElementById('goals-achievement-plan').innerHTML = renderGoalsAchievementPlan(result);
	} catch (error) {
	  console.error('Error analyzing data:', error);
	  document.getElementById('analysis-result').innerHTML = `
	    <p style="color:red;">${error.message}</p>
	    <p>Check your input or try again later.</p>
	  `;
	}
      });
      
      
      
      

      let pieChartInstance = null; // Global variable to store the chart instance

      function renderPieChart(data) {
	const ctx = document.getElementById('pieChart').getContext('2d');
	const budgetSummary = data.budget_summary;
      
	// Calculate total monthly contributions needed for goals
	const totalGoalContributions = data.goals_achievement_plan
	  ? data.goals_achievement_plan.reduce((sum, goal) => sum + (goal.monthly_contribution_needed || 0), 0)
	  : 0;
      
	// Destroy the existing chart if it exists
	if (pieChartInstance) {
	  pieChartInstance.destroy();
	}
      
	// Create the new chart
	pieChartInstance = new Chart(ctx, {
	  type: 'pie',
	  data: {
	    labels: ['Total Expenses', 'Remaining Balance', 'Goal Contributions'],
	    datasets: [{
	      label: 'Budget Distribution',
	      data: [
		budgetSummary.total_expenses,
		budgetSummary.remaining_balance - totalGoalContributions, // Remaining balance after goal contributions
		totalGoalContributions
	      ],
	      backgroundColor: [
		'rgba(255, 99, 132, 0.2)', // Expenses color
		'rgba(75, 192, 192, 0.2)', // Remaining balance color
		'rgba(54, 162, 235, 0.2)'  // Goal contributions color
	      ],
	      borderColor: [
		'rgba(255, 99, 132, 1)', // Expenses border
		'rgba(75, 192, 192, 1)', // Remaining balance border
		'rgba(54, 162, 235, 1)'  // Goal contributions border
	      ],
	      borderWidth: 1
	    }]
	  },
	  options: {
	    responsive: true,
	    plugins: {
	      legend: {
		position: 'top',
	      },
	      tooltip: {
		callbacks: {
		  label: function (context) {
		    const label = context.label || '';
		    const value = context.raw || 0;
		    return `${label}: $${value}`;
		  }
		}
	      }
	    }
	  }
	});
      }
      
      

      function renderGoalsAchievementPlan(data) {
	const goals = data.goals_achievement_plan || [];
     
	if (goals.length === 0) {
	  return "<p>No goals provided or achievable plans available.</p>";
	}
     
	return goals.map(goal => {
	  // Convert `monthly_contribution_needed` to a number if it isn't already
	  const monthlyContribution = parseFloat(goal.monthly_contribution_needed) || 0;
     
	  return `
	    <li>
	      <strong>Goal:</strong> ${goal.goal_name}<br>
	      <strong>Target Amount:</strong> $${goal.target_amount}<br>
	      <strong>Deadline:</strong> ${goal.deadline}<br>
	      <strong>Feasibility:</strong> ${goal.feasibility}<br>
	      <strong>Monthly Contribution Needed:</strong> $${monthlyContribution.toFixed(2)}<br>
	      <strong>Plan:</strong> ${goal.action_plan}
	    </li>
	  `;
	}).join('');
     }
     