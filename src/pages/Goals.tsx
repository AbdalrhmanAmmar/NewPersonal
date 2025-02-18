import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, DollarSign, Bell, Pencil, Trash2, ChevronRight, Trophy, AlertCircle } from 'lucide-react';
import { useGoalsStore } from '../store/GoalStore';
import { useAuthStore } from '../store/authStore';
import { Goal } from '../lib/firebase';

const Goals = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { user } = useAuthStore();
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, fetchGoals } = useGoalsStore();

  useEffect(() => {
    if (user?.uid) {
      fetchGoals(user.uid);
    }
  }, [user]);

  const handleAddGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newGoal: Goal = {
      id: '', // Will be set by Firestore
      userId: user?.uid || '',
      name: formData.get('name') as string,
      targetAmount: Number(formData.get('targetAmount')),
      currentAmount: 0,
      deadline: new Date(formData.get('deadline') as string),
      category: formData.get('category') as string,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await createGoal(newGoal);
      setShowAddGoal(false);
    } catch (err) {
      console.error('Error adding goal:', err);
    }
  };

  const handleEditGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGoal) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedGoal: Goal = {
      ...selectedGoal,
      name: formData.get('name') as string,
      targetAmount: Number(formData.get('targetAmount')),
      currentAmount: Number(formData.get('currentAmount')),
      deadline: new Date(formData.get('deadline') as string),
      category: formData.get('category') as string,
      updatedAt: new Date()
    };

    try {
      await updateGoal(selectedGoal.id, updatedGoal);
      setSelectedGoal(null);
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?') && user?.uid) {
      try {
        await deleteGoal(goalId, user.uid);
      } catch (err) {
        console.error('Error deleting goal:', err);
      }
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const formatDate = (date: Date | string | number) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return undefined;
      }
      return d.toISOString().split('T')[0];
    } catch (error) {
      return undefined;
    }
  };

  const getDaysRemaining = (deadline: Date) => {
    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return 0;
      }
      const diffTime = Math.max(deadlineDate.getTime() - today.getTime(), 0);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch (error) {
      return 0;
    }
  };

  const calculateMonthlyTarget = (targetAmount: number, currentAmount: number, daysRemaining: number) => {
    if (daysRemaining <= 0) return 0;
    const monthlyTarget = (targetAmount - currentAmount) / (daysRemaining / 30);
    return isFinite(monthlyTarget) ? Math.max(monthlyTarget, 0) : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const monthlyTarget = calculateMonthlyTarget(goal.targetAmount, goal.currentAmount, daysRemaining);
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
                      onClick={() => setSelectedGoal(goal)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">${goal.currentAmount.toLocaleString()}</span>
                    <span className="text-gray-500">of ${goal.targetAmount.toLocaleString()}</span>
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
                      ${monthlyTarget.toFixed(2)} monthly target
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
                <button
                  onClick={() => setSelectedGoal(goal)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Update Progress
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Goal Modal */}
      {(showAddGoal || selectedGoal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <form onSubmit={selectedGoal ? handleEditGoal : handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={selectedGoal?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Vacation Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount
                </label>
                <input
                  name="targetAmount"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={selectedGoal?.targetAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
              {selectedGoal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Amount
                  </label>
                  <input
                    name="currentAmount"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    defaultValue={selectedGoal.currentAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter current amount"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  required
                  defaultValue={selectedGoal?.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Travel">Travel</option>
                  <option value="Savings">Savings</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Education">Education</option>
                  <option value="Home">Home</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  name="deadline"
                  type="date"
                  required
                  defaultValue={selectedGoal ? formatDate(selectedGoal.deadline) : undefined}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {selectedGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGoal(false);
                    setSelectedGoal(null);
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

export default Goals;