import React, { useState } from 'react';
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
  ChartData,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Calendar, Filter } from 'lucide-react';

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

// Mock data
const monthlySpendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Actual Spending',
      data: [1200, 1350, 1400, 1150, 1300, 1450],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Budget',
      data: [1300, 1300, 1300, 1300, 1300, 1300],
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      fill: false,
    },
  ],
};

const categoryData = {
  labels: ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Healthcare'],
  datasets: [
    {
      data: [350, 320, 150, 180, 250, 100],
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

const budgetComparisonData = {
  labels: ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Shopping', 'Healthcare'],
  datasets: [
    {
      label: 'Actual',
      data: [350, 320, 150, 180, 250, 100],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    },
    {
      label: 'Budget',
      data: [400, 300, 200, 250, 300, 200],
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
    },
  ],
};

const savingsGoalsData = {
  labels: ['Vacation Fund', 'Emergency Fund', 'New Car'],
  datasets: [
    {
      data: [1500, 4000, 5000],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
    },
    {
      data: [1500, 6000, 15000],
      backgroundColor: [
        'rgba(16, 185, 129, 0.2)',
        'rgba(59, 130, 246, 0.2)',
        'rgba(139, 92, 246, 0.2)',
      ],
    },
  ],
};

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

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');

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
                        return `$${value} (${percentage}%)`;
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

        {/* Savings Goals Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Savings Goals Progress</h2>
          <div className="h-80">
            <Bar
              data={savingsGoalsData}
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
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const datasetIndex = context.datasetIndex;
                        const value = context.raw as number;
                        return datasetIndex === 0
                          ? `Current: $${value}`
                          : `Target: $${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Highest Expense Category</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900">Groceries</p>
            <p className="mt-1 text-sm text-blue-700">$350 this month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800">Monthly Savings</p>
            <p className="mt-1 text-2xl font-semibold text-green-900">$450</p>
            <p className="mt-1 text-sm text-green-700">15% increase from last month</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-800">Budget Status</p>
            <p className="mt-1 text-2xl font-semibold text-purple-900">On Track</p>
            <p className="mt-1 text-sm text-purple-700">8% under budget</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;