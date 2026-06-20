// ============================================
// Student Expense Dashboard - Terminal Demo
// ============================================

console.log('\n╔════════════════════════════════════════╗');
console.log('║   STUDENT EXPENSE DASHBOARD - OUTPUT   ║');
console.log('════════════════════════════════════╝\n');

// State Management
let expenses = [];
let budget = 0;

// Core Functions
const setBudget = (amount) => {
    if (isNaN(amount) || amount < 0) {
        console.log('❌ Invalid budget amount.');
        return false;
    }
    budget = amount;
    console.log(`✅ Budget set to: ₹${budget.toFixed(2)}`);
    return true;
};

const addExpense = (amount, category, date, notes = '') => {
    if (isNaN(amount) || amount <= 0) {
        console.log('❌ Invalid expense amount.');
        return false;
    }
    
    const expense = {
        id: Date.now().toString(),
        amount,
        category,
        date,
        notes
    };
    
    expenses.push(expense);
    console.log(`✅ Expense added: ${category} - ₹${amount.toFixed(2)} on ${date}`);
    return true;
};

const deleteExpense = (id) => {
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
        expenses.splice(index, 1);
        console.log('✅ Expense deleted successfully');
        return true;
    }
    console.log('❌ Expense not found');
    return false;
};

const calculateSummary = () => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;
    
    return {
        budget,
        totalSpent,
        remaining,
        count: expenses.length
    };
};

const renderSummary = () => {
    const summary = calculateSummary();
    
    console.log('\n┌─ BUDGET SUMMARY ─────────────────────┐');
    console.log(`│ Monthly Budget:    ₹${summary.budget.toFixed(2).padEnd(21)}`);
    console.log(`│ Total Spent:       ₹${summary.totalSpent.toFixed(2).padEnd(21)}`);
    console.log(`│ Remaining:         ₹${summary.remaining.toFixed(2).padEnd(21)}`);
    console.log(`│ Transactions:      ${summary.count.toString().padEnd(21)}`);
    
    if (summary.remaining < 0) {
        console.log(`│ Status:            ⚠️  OVER BUDGET      `);
    } else {
        console.log(`│ Status:            ✅ Within Budget    `);
    }
    console.log('└──────────────────────────────────────┘');
};

const renderCategoryBreakdown = () => {
    if (expenses.length === 0) {
        console.log('\n📊 No expenses to display\n');
        return;
    }
    
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    console.log('\n📊 SPENDING BY CATEGORY');
    console.log('├─────────────────────────────');
    
    Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, total], index) => {
            const percentage = ((total / calculateSummary().totalSpent) * 100).toFixed(1);
            const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
            console.log(`│ ${category.padEnd(15)} ${bar} ${percentage}%`);
        });
    
    console.log('└─────────────────────────────\n');
};

const renderExpenseList = () => {
    if (expenses.length === 0) {
        console.log('\n📋 EXPENSE LIST: No expenses recorded\n');
        return;
    }
    
    console.log('\n📋 RECENT EXPENSES');
    console.log('┌─────────────┬──────────────┬──────────┬─────────────────────┐');
    console.log('│ Date        │ Category     │ Amount   │ Notes               │');
    console.log('├─────────────┼──────────────┼──────────┼─────────────────────┤');
    
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedExpenses.forEach(exp => {
        const notes = (exp.notes || '-').substring(0, 19).padEnd(19);
        console.log(
            `│ ${exp.date} │ ${exp.category.padEnd(12)} │ ₹${exp.amount.toFixed(2).padStart(6)} │ ${notes} │`
        );
    });
    
    console.log('└─────────────┴──────────────┴──────────┴─────────────────────┘\n');
};

// ============================================
// DEMO: Simulate User Actions
// ============================================

console.log('📝 SIMULATION START...\n');

// Step 1: Set Budget
console.log('1️⃣  Setting monthly budget...');
setBudget(5000);

// Step 2: Add Expenses
console.log('\n2️⃣  Adding expenses...');
addExpense(450, 'Food', '2026-06-19', 'Lunch at cafeteria');
addExpense(200, 'Transport', '2026-06-19', 'Bus pass');
addExpense(300, 'Study', '2026-06-18', 'Books and stationery');
addExpense(150, 'Entertainment', '2026-06-17', 'Movie tickets');
addExpense(250, 'Food', '2026-06-17', 'Dinner with friends');
addExpense(100, 'Other', '2026-06-16', 'Miscellaneous');

// Step 3: Display Summary
console.log('\n3️⃣  Generating reports...');
renderSummary();

// Step 4: Display Category Breakdown
renderCategoryBreakdown();

// Step 5: Display Expense List
renderExpenseList();

// Step 6: Advanced Statistics
console.log('📈 ADVANCED STATISTICS');
console.log('├─ Daily Spending Pattern:');
const dailyTotals = {};
expenses.forEach(exp => {
    dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
});

Object.entries(dailyTotals)
    .sort()
    .reverse()
    .forEach(([date, total]) => {
        console.log(`│  ${date}: ₹${total.toFixed(2)}`);
    });

console.log('├─ Average Expense: ₹' + (calculateSummary().totalSpent / expenses.length).toFixed(2));
console.log('├─ Highest Expense: ₹' + Math.max(...expenses.map(e => e.amount)).toFixed(2));
console.log('├─ Lowest Expense: ₹' + Math.min(...expenses.map(e => e.amount)).toFixed(2));
console.log('└─ Days Since Start: ' + expenses.length + ' transactions\n');

// Final Status
const summary = calculateSummary();
console.log('╔════════════════════════════════════════╗');
if (summary.remaining < 0) {
    console.log('║ ⚠️  WARNING: BUDGET EXCEEDED!          ║');
    console.log(`║ Overspent by: ₹${Math.abs(summary.remaining).toFixed(2)}`.padEnd(39) + '║');
} else {
    console.log('║ ✅ ON TRACK WITH BUDGET                ║');
    console.log(`║ Remaining: ₹${summary.remaining.toFixed(2)}`.padEnd(39) + '║');
}
console.log('╚════════════════════════════════════════╝\n');
