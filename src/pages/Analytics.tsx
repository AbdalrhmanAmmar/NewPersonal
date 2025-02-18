import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Calendar, Filter } from 'lucide-react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useAuthStore } from '../store/authStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const categories = {
  Groceries: { budget: 400 },
  Entertainment: { budget: 200 },
  Transportation: { budget: 250 },
  Utilities: { budget: 300 },
  Shopping: { budget: 300 },
  Healthcare: { budget: 200 },
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const { user } = useAuthStore();
  const { expenses, loading, error, fetchExpenses } = useExpenseStore();

  useEffect(() => {
    if (user?.uid) {
      fetchExpenses(user.uid);
    }
  }, [user]);

  // Helper function to group expenses by month
  const groupExpensesByMonth = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += expense.amount;
      return acc;
    }, {});
  };

  // Helper function to group expenses by category
  const groupExpensesByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});
  };

  // Prepare data for monthly spending chart
  const monthlySpendingData = useMemo(() => {
    const monthlyExpenses = groupExpensesByMonth(expenses);
    const months = Object.keys(monthlyExpenses);
    const spendingData = Object.values(monthlyExpenses);
    const budgetLine = Array(months.length).fill(1300); // Example budget line

    return {
      labels: months,
      datasets: [
        {
          label: 'Actual Spending',
          data: spendingData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Budget',
          data: budgetLine,
          borderColor: 'rgb(239, 68, 68)',
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  }, [expenses]);

  // Prepare data for category distribution
  const categoryData = useMemo(() => {
    const categoryExpenses = groupExpensesByCategory(expenses);
    return {
      labels: Object.keys(categoryExpenses),
      datasets: [
        {
          data: Object.values(categoryExpenses),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
        },
      ],
    };
  }, [expenses]);

  // Prepare data for budget comparison
  const budgetComparisonData = useMemo(() => {
    const categoryExpenses = groupExpensesByCategory(expenses);
    const categories = Object.keys(categoryExpenses);
    const actualSpending = Object.values(categoryExpenses);
    const budgetAmounts = categories.map(category => categories[category]?.budget || 0);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Actual',
          data: actualSpending,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
          label: 'Budget',
          data: budgetAmounts,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
        },
      ],
    };
  }, [expenses]);

  // Calculate key insights
  const insights = useMemo(() => {
    const categoryExpenses = groupExpensesByCategory(expenses);
    const highestCategory = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)[0];
    
    const totalSpending = Object.values(categoryExpenses).reduce((a, b) => a + b, 0);
    const monthlyExpenses = groupExpensesByMonth(expenses);
    const currentMonth = Object.keys(monthlyExpenses).pop();
    const previousMonth = Object.keys(monthlyExpenses).slice(-2)[0];
    
    const monthlyChange = currentMonth && previousMonth
      ? ((monthlyExpenses[currentMonth] - monthlyExpenses[previousMonth]) / monthlyExpenses[previousMonth]) * 100
      : 0;

    return {
      highestCategory: {
        name: highestCategory?.[0] || 'N/A',
        amount: highestCategory?.[1] || 0,
      },
      monthlyChange,
      totalSpending,
    };
  }, [expenses]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
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
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Visualize your financial data</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Spending Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending Trends</h2>
          <div className="h-80">
            <Line
              data={monthlySpendingData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Expense Distribution</h2>
          <div className="h-80">
            <Doughnut
              data={categoryData}
              options={{
                ...chartOptions,
                cutout: '60%',
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw as number;
                        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `$${value.toFixed(2)} (${percentage}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget vs Actual</h2>
          <div className="h-80">
            <Bar
              data={budgetComparisonData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Highest Expense Category</p>
              <p className="mt-1 text-2xl font-semibold text-blue-900">{insights.highestCategory.name}</p>
              <p className="mt-1 text-sm text-blue-700">${insights.highestCategory.amount.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Monthly Change</p>
              <p className="mt-1 text-2xl font-semibold text-green-900">
                {insights.monthlyChange > 0 ? '+' : ''}{insights.monthlyChange.toFixed(1)}%
              </p>
              <p className="mt-1 text-sm text-green-700">From last month</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Total Spending</p>
              <p className="mt-1 text-2xl font-semibold text-purple-900">${insights.totalSpending.toFixed(2)}</p>
              <p className="mt-1 text-sm text-purple-700">All time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;