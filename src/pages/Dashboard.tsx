import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingDown, Wallet, PieChart, Calendar, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useGoalsStore } from '../store/GoalStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { useBalanceStore } from '../store/balanceStore';
import FinancialChatbot from '../components/FinancialChatbot';

const Dashboard = () => {
  const [showAddBalance, setShowAddBalance] = useState(false);
  const { user } = useAuthStore();
  const { goals } = useGoalsStore();
  const { expenses } = useExpenseStore();
  const {
    fetchBalance,
    addTransaction,
    calculateTotalBalance,
    calculateMonthlyExpenses,
    calculateMonthlySavings,
    calculateRemainingBudget,
  } = useBalanceStore();

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'deposit',
    description: '',
  });

  useEffect(() => {
    if (user?.uid) {
      fetchBalance(user.uid);
    }
  }, [user]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    const transaction = {
      userId: user.uid,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type as 'deposit' | 'withdrawal',
      description: newTransaction.description,
      date: new Date(),
    };

    try {
      await addTransaction(transaction);
      setShowAddBalance(false);
      setNewTransaction({
        amount: '',
        type: 'deposit',
        description: '',
      });
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  // Calculate total goals amount
  const totalGoalsAmount = goals.reduce((total, goal) => total + goal.targetAmount, 0);

  // Get the actual values
  const totalBalance = calculateTotalBalance();
  const monthlyExpenses = calculateMonthlyExpenses();
  const savings = calculateMonthlySavings();
  const remainingBudget = totalBalance - (monthlyExpenses + totalGoalsAmount);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.displayName || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's an overview of your finances today.</p>
          </div>
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p className="italic">"A penny saved is a penny earned."</p>
            <p className="text-right mt-1">- Benjamin Franklin</p>
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          amount={totalBalance}
          icon={<DollarSign />}
          color="text-green-600"
          bgColor="bg-green-50"
          onAdd={() => setShowAddBalance(true)}
        />
        <MetricCard
          title="Monthly Expenses"
          amount={monthlyExpenses}
          icon={<TrendingDown />}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <MetricCard
          title="Savings"
          amount={savings}
          icon={<Wallet />}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Remaining Budget"
          amount={remainingBudget}
          icon={<PieChart />}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Rest of the dashboard content */}
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
                    <th className="pb-4">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-gray-50">
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
                      <td className="py-3 text-sm">{transaction.category}</td>
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
            {goals.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                  <span className="text-sm text-gray-500">
                    ${goal.currentAmount} of ${goal.targetAmount}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Balance Modal */}
      {showAddBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBalance(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Financial Chatbot */}
      <FinancialChatbot />
    </div>
  );
};

const MetricCard = ({
  title,
  amount,
  icon,
  color,
  bgColor,
  onAdd,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onAdd?: () => void;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex items-center space-x-2">
        {onAdd && (
          <button
            onClick={onAdd}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        )}
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <span className={`w-5 h-5 ${color}`}>{icon}</span>
        </div>
      </div>
    </div>
    <p className="mt-2 text-2xl font-semibold">${amount.toFixed(2)}</p>
  </div>
);

export default Dashboard;