// Primitive Types & State Management
let expenses = [];
let budget = 0;
let chartInstance = null;

// JS Promises: Wrap localStorage operations for async-like behavior
const loadData = () => {
    return new Promise((resolve) => {
        const savedExpenses = localStorage.getItem('student_expenses');
        const savedBudget = localStorage.getItem('student_budget');
        
        if (savedExpenses) expenses = JSON.parse(savedExpenses);
        if (savedBudget) budget = parseFloat(savedBudget);
        resolve({ expenses, budget });
    });
};

const saveData = () => {
    return new Promise((resolve) => {
        localStorage.setItem('student_expenses', JSON.stringify(expenses));
        localStorage.setItem('student_budget', budget.toString());
        resolve(true);
    });
};

// Core Functions
const initApp = async () => {
    document.getElementById('date').valueAsDate = new Date();
    await loadData(); // Using Promise
    updateUI();
};

function setBudget() {
    const input = document.getElementById('budgetInput');
    const amount = parseFloat(input.value);
    
    // Conditionals: Validate input
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid budget amount.');
        return;
    }
    
    budget = amount;
    input.value = '';
    saveData().then(() => updateUI());
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const editId = document.getElementById('editId').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value;

    // Conditionals: Validation
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
    }

    if (editId) {
        const index = expenses.findIndex(exp => exp.id === editId);
        if (index !== -1) expenses[index] = { id: editId, amount, category, date, notes };
    } else {
        expenses.push({ id: Date.now().toString(), amount, category, date, notes });
    }

    resetForm();
    saveData().then(() => updateUI());
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(exp => exp.id !== id);
        saveData().then(() => updateUI());
    }
}

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    document.getElementById('editId').value = expense.id;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    document.getElementById('notes').value = expense.notes;

    document.getElementById('formTitle').textContent = 'Edit Expense';
    document.getElementById('submitBtn').textContent = 'Update Expense';
    document.getElementById('cancelBtn').classList.remove('hidden');
}

function resetForm() {
    document.getElementById('expenseForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('formTitle').textContent = 'Add Expense';
    document.getElementById('submitBtn').textContent = 'Add Expense';
    document.getElementById('cancelBtn').classList.add('hidden');
}

// UI Rendering Functions
const updateUI = () => {
    renderSummary();
    renderList();
    renderChart();
};

const renderSummary = () => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;

    document.getElementById('headerBudget').textContent = `₹${budget.toFixed(2)}`;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
    document.getElementById('remainingBudget').textContent = `₹${remaining.toFixed(2)}`;
    document.getElementById('totalCount').textContent = expenses.length;

    const remainingEl = document.getElementById('remainingBudget');
    if (remaining < 0) {
        remainingEl.classList.remove('text-emerald-600');
        remainingEl.classList.add('text-red-600');
    } else {
        remainingEl.classList.remove('text-red-600');
        remainingEl.classList.add('text-emerald-600');
    }
};

const renderList = () => {
    const tbody = document.getElementById('expenseList');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (expenses.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach(exp => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-100 hover:bg-slate-50 transition';
        row.innerHTML = `
            <td class="py-3">${exp.date}</td>
            <td class="py-3"><span class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">${exp.category}</span></td>
            <td class="py-3 text-slate-500">${exp.notes || '-'}</td>
            <td class="py-3 text-right font-medium">₹${exp.amount.toFixed(2)}</td>
            <td class="py-3 text-right space-x-2">
                <button onclick="editExpense('${exp.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit</button>
                <button onclick="deleteExpense('${exp.id}')" class="text-red-600 hover:text-red-800 font-medium text-xs">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

const renderChart = () => {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categoryTotals = {};
    
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chartInstance) chartInstance.destroy();

    if (labels.length === 0) {
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#e2e8f0'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        return;
    }

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#64748b'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right', labels: { usePointStyle: true, padding: 15 } } }
        }
    });
};

// Event Listeners
document.getElementById('expenseForm').addEventListener('submit', handleFormSubmit);
initApp();