import React, { useState } from 'react';
import { Plus, Target, Calendar, DollarSign, Bell, Pencil, Trash2, ChevronRight, Trophy, AlertCircle } from 'lucide-react';

// Mock data - replace with real data later
const mockGoals = [
  {
    id: 1,
    name: "Vacation Fund",
    target: 5000,
    current: 2000,
    deadline: "2024-12-31",
    monthlySavingsTarget: 250,
    category: "Travel",
    contributions: [
      { date: "2024-03-01", amount: 500 },
      { date: "2024-02-15", amount: 750 },
      { date: "2024-02-01", amount: 750 },
    ]
  },
  {
    id: 2,
    name: "Emergency Fund",
    target: 10000,
    current: 6000,
    deadline: "2024-09-30",
    monthlySavingsTarget: 500,
    category: "Savings",
    contributions: [
      { date: "2024-03-01", amount: 1000 },
      { date: "2024-02-15", amount: 2500 },
      { date: "2024-02-01", amount: 2500 },
    ]
  },
  {
    id: 3,
    name: "New Car",
    target: 25000,
    current: 8000,
    deadline: "2025-06-30",
    monthlySavingsTarget: 1000,
    category: "Vehicle",
    contributions: [
      { date: "2024-03-01", amount: 2000 },
      { date: "2024-02-15", amount: 3000 },
      { date: "2024-02-01", amount: 3000 },
    ]
  }
];

const Goals = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
          <p className="text-gray-600">Track and achieve your savings targets</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Goal
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const progressColor = getProgressColor(progress);

          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">${goal.current.toLocaleString()}</span>
                    <span className="text-gray-500">of ${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {daysRemaining} days remaining
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      ${goal.monthlySavingsTarget} monthly target
                    </span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {goal.contributions.slice(0, 2).map((contribution, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(contribution.date).toLocaleDateString()}
                        </span>
                        <span className="font-medium text-green-600">
                          +${contribution.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
                <button
                  onClick={() => setSelectedGoal(goal.id)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add Contribution
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestones and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Milestones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Milestones</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">Emergency Fund: 60% Complete!</p>
                <p className="text-sm text-green-600">You're well on your way to your goal!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Vacation Fund: 40% Milestone</p>
                <p className="text-sm text-blue-600">Keep up the great work!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Goal Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">New Car Goal: Slightly Behind</p>
                <p className="text-sm text-yellow-600">
                  Consider increasing monthly contributions by $100 to stay on track.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-purple-800">Upcoming Milestone</p>
                <p className="text-sm text-purple-600">
                  You're just $500 away from reaching 50% of your Emergency Fund goal!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Vacation Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount
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
                  <option>Travel</option>
                  <option>Savings</option>
                  <option>Vehicle</option>
                  <option>Education</option>
                  <option>Home</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
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
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
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

export default Goals;