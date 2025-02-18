import React, { useState, useEffect } from 'react';
import {

  RefreshCw,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/authStore';
import ExpenseItem from '../components/ExpenseItem';
import { Expense } from '../lib/firebase';

const categories = {
  Groceries: { spent: 0, budget: 400 },
  Entertainment: { spent: 0, budget: 200 },
  Transportation: { spent: 0, budget: 250 },
  Utilities: { spent: 0, budget: 300 },
  Shopping: { spent: 0, budget: 300 },
  Healthcare: { spent: 0, budget: 200 },
};

const mockRecurring = [
  { name: 'Netflix', amount: 15.99, nextDate: '2024-04-15' },
  { name: 'Gym Membership', amount: 49.99, nextDate: '2024-04-01' },
  { name: 'Internet Bill', amount: 79.99, nextDate: '2024-04-05' },
];

const mockSavingsGoals = [
  { name: 'Vacation Fund', target: 3000, current: 1500 },
  { name: 'Emergency Fund', target: 10000, current: 4000 },
  { name: 'New Car', target: 20000, current: 5000 },
];

const Expenses = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { user } = useAuthStore();
  const { expenses, loading, error, addExpense, updateExpense, removeExpense, fetchExpenses } = useExpenseStore();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user?.uid) {
      fetchExpenses(user.uid);
    }
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    const expenseData: Omit<Expense, 'id'> = {
      userId: user.uid,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date(newExpense.date),
      paymentMethod: 'Card',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, { ...expenseData });
      } else {
        await addExpense(expenseData);
      }
      setShowAddExpense(false);
      setSelectedExpense(null);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Groceries',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Error with expense:', err);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setNewExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
    });
    setShowAddExpense(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await removeExpense(expenseId);
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categoryId;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Track Expenses</h1>
          <p className="text-gray-600">Manage and analyze your spending</p>
        </div>
        <button
          onClick={() => {
            setSelectedExpense(null);
            setNewExpense({
              description: '',
              amount: '',
              category: 'Groceries',
              date: new Date().toISOString().split('T')[0],
            });
            setShowAddExpense(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Expense List and Forms */}
        <div className="col-span-2 space-y-6">
          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    getCategoryName={getCategoryName}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Spending Trends */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending Trends</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Monthly Spending Trend Chart</p>
            </div>
          </div> */}
        </div>

        {/* Right Column - Summary and Insights */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h2>
            <div className="space-y-4">
              {Object.entries(categories).map(([category, { spent, budget }]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{category}</span>
                    <span className="text-gray-800">
                      ${spent.toFixed(2)} / ${budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        spent > budget ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((spent / budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Expenses */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Payments</h2>
            <div className="space-y-4">
              {mockRecurring.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">${item.amount}</p>
                    <p className="text-sm text-gray-500">Due {item.nextDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Goals */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Goals</h2>
            <div className="space-y-4">
              {mockSavingsGoals.map((goal) => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{goal.name}</span>
                    <span className="text-gray-800">
                      ${goal.current} / ${goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Savings Insights */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Insights</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-800">
                    Your entertainment spending is 25% higher than last month. Consider
                    reviewing your subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {selectedExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExpense(false);
                    setSelectedExpense(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;