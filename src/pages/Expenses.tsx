import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  Bell,
  TrendingUp,
  Target,
  RefreshCw,
  FileText,
  Plus,
  AlertCircle
} from 'lucide-react';

// Mock data - replace with real data later
const mockExpenses = [
  { id: 1, date: '2024-03-15', description: 'Grocery Store', category: 'Groceries', amount: 85.50 },
  { id: 2, date: '2024-03-14', description: 'Netflix', category: 'Entertainment', amount: 15.99 },
  { id: 3, date: '2024-03-13', description: 'Gas Station', category: 'Transportation', amount: 45.00 },
  { id: 4, date: '2024-03-12', description: 'Electric Bill', category: 'Utilities', amount: 120.00 },
];

const mockCategories = {
  Groceries: { spent: 350, budget: 400 },
  Entertainment: { spent: 150, budget: 200 },
  Transportation: { spent: 180, budget: 250 },
  Utilities: { spent: 320, budget: 300 },
  Shopping: { spent: 250, budget: 300 },
  Healthcare: { spent: 100, budget: 200 },
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
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Track Expenses</h1>
          <p className="text-gray-600">Manage and analyze your spending</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'categories', label: 'Categories', icon: PieChart },
          { id: 'recurring', label: 'Recurring', icon: RefreshCw },
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center px-4 py-2 border-b-2 ${
              activeTab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } -mb-px`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </button>
        ))}
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
                {mockExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spending Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending Trends</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              {/* Placeholder for actual chart */}
              <p className="text-gray-500">Monthly Spending Trend Chart</p>
            </div>
          </div>
        </div>

        {/* Right Column - Summary and Insights */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Overview</h2>
            <div className="space-y-4">
              {Object.entries(mockCategories).map(([category, { spent, budget }]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{category}</span>
                    <span className="text-gray-800">
                      ${spent} / ${budget}
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
          <div className="bg-white rounded-xl shadow-sm p-6">
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
          </div>

          {/* Savings Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
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
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-800">
                    Great job! Your grocery spending is under budget this month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Groceries</option>
                  <option>Entertainment</option>
                  <option>Transportation</option>
                  <option>Utilities</option>
                  <option>Shopping</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Add Expense
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
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