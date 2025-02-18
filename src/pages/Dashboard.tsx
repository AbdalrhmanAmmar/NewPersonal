import React from 'react';
import { DollarSign, TrendingDown, Wallet, PieChart, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useGoalsStore } from '../store/GoalStore';


// Mock data - replace with real data later
const mockData = {
  userName: "John",
  balance: 5240.50,
  monthlyExpenses: 1250.75,
  savings: 850.25,
  remainingBudget: 749.25,
  goals: [
    { name: "Vacation", target: 1000, current: 600 },
    { name: "New Laptop", target: 2000, current: 800 }
  ],
  recentTransactions: [
    { date: "2024-03-15", description: "Grocery Store", category: "Food", amount: 85.50, method: "Card" },
    { date: "2024-03-14", description: "Gas Station", category: "Transportation", amount: 45.00, method: "Card" },
    { date: "2024-03-13", description: "Netflix", category: "Entertainment", amount: 15.99, method: "Card" },
    { date: "2024-03-12", description: "Restaurant", category: "Food", amount: 32.40, method: "Cash" },
  ]
};

const Dashboard = () => {
  const { user } = useAuthStore(); // Access user from Zustand store
  const { goals, fetchGoals, loading, error } = useGoalsStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">      Welcome back, {user?.displayName || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's an overview of your finances today.</p>
          </div>
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg"> show 
            <p className="italic">"A penny saved is a penny earned."</p>
            <p className="text-right mt-1">- Benjamin Franklin</p>
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          amount={mockData.balance}
          icon={<DollarSign />}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <MetricCard
          title="Monthly Expenses"
          amount={mockData.monthlyExpenses}
          icon={<TrendingDown />}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <MetricCard
          title="Savings"
          amount={mockData.savings}
          icon={<Wallet />}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Remaining Budget"
          amount={mockData.remainingBudget}
          icon={<PieChart />}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-t border-gray-50">
                      <td className="py-3 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 text-sm">{transaction.description}</td>
                      <td className="py-3 text-sm font-medium text-red-600">
                        -${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-sm">{transaction.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Financial Goals</h2>
          </div>
          <div className="p-6 space-y-6">
            {loading ? (
              <p>Loading goals...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              goals.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                    <span className="text-sm text-gray-500">
                      ${goal.currentAmount} of ${goal.targetAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Budget Status</h2>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: '75%' }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          75% of your budget is used this month. Keep an eye on your spending!
        </p>
      </div>
    </div>
  );
};

const MetricCard = ({ title, amount, icon, color, bgColor }: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <span className={`w-5 h-5 ${color}`}>{icon}</span>
      </div>
    </div>
    <p className="mt-2 text-2xl font-semibold">${amount.toFixed(2)}</p>
  </div>
);

export default Dashboard;