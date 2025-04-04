import React, { useState, useEffect } from "react";
import {
  Plus,
  Target,
  Calendar,
  DollarSign,
  Bell,
  Pencil,
  Trash2,
  ChevronRight,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { useGoalsStore } from "../store/GoalStore";
import { useAuthStore } from "../store/authStore";
import { Goal } from "../lib/firebase";

const Goals = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { user } = useAuthStore();
  const {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    fetchGoals,
  } = useGoalsStore();

  // Fetch goals when user changes
  useEffect(() => {
    if (user?.uid) {
      fetchGoals(user.uid);
    }
  }, [user?.uid, fetchGoals]);

  const handleAddGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!user?.uid) {
      alert("Please sign in to create a goal");
      return;
    }

    const name = formData.get("name") as string;
    const targetAmount = Number(formData.get("targetAmount"));
    const deadline = formData.get("deadline") as string;
    const category = formData.get("category") as string;

    // Validate inputs
    if (!name || name.trim() === "") {
      alert("Please enter a goal name");
      return;
    }

    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert("Please enter a valid target amount");
      return;
    }

    if (!deadline) {
      alert("Please select a deadline");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      alert("Please enter a valid deadline date");
      return;
    }

    const newGoal: Goal = {
      userId: user.uid,
      name: name.trim(),
      targetAmount,
      currentAmount: 0,
      deadline: deadlineDate,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await createGoal(newGoal);
      setShowAddGoal(false);
      form.reset();
    } catch (err) {
      console.error("Error adding goal:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to create goal. Please try again."
      );
    }
  };

  const handleEditGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGoal || !user?.uid) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const updatedGoal: Goal = {
      ...selectedGoal,
      name: formData.get("name") as string,
      targetAmount: Number(formData.get("targetAmount")),
      currentAmount: Number(formData.get("currentAmount")) || 0,
      deadline: new Date(formData.get("deadline") as string),
      category: formData.get("category") as string,
      updatedAt: new Date(),
    };

    try {
      await updateGoal(selectedGoal.id, updatedGoal);
      setSelectedGoal(null);
    } catch (err) {
      console.error("Error updating goal:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update goal. Please try again."
      );
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (
      window.confirm("Are you sure you want to delete this goal?") &&
      user?.uid
    ) {
      try {
        await deleteGoal(goalId, user.uid);
      } catch (err) {
        console.error("Error deleting goal:", err);
        alert(
          err instanceof Error
            ? err.message
            : "Failed to delete goal. Please try again."
        );
      }
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return (current / target) * 100;
  };

  const formatDate = (date: Date | string | number | undefined) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Invalid Date";
      return d.toLocaleDateString();
    } catch (_error) {
      return "Invalid Date";
    }
  };

  const getDaysRemaining = (deadline: Date | undefined): number => {
    if (!deadline) return 0;
    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) return 0;
      const diffTime = Math.max(deadlineDate.getTime() - today.getTime(), 0);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (_error) {
      return 0;
    }
  };

  const calculateMonthlyTarget = (
    targetAmount: number,
    currentAmount: number,
    daysRemaining: number
  ) => {
    if (daysRemaining <= 0) return 0;
    const monthlyTarget = (targetAmount - currentAmount) / (daysRemaining / 30);
    return isFinite(monthlyTarget) ? Math.max(monthlyTarget, 0) : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Goals</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {goals.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No goals yet</h3>
          <p className="text-gray-500 mt-2">
            Start by creating your first financial goal
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{goal.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-500" />
                  <span>
                    {goal.currentAmount} / {goal.targetAmount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Deadline: {formatDate(goal.deadline)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-gray-500" />
                  <span>Category: {goal.category}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {Math.round(
                      calculateProgress(goal.currentAmount, goal.targetAmount)
                    )}
                    %
                  </span>
                  <span>{getDaysRemaining(goal.deadline)} days remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getProgressColor(
                      calculateProgress(goal.currentAmount, goal.targetAmount)
                    )}`}
                    style={{
                      width: `${Math.min(
                        calculateProgress(
                          goal.currentAmount,
                          goal.targetAmount
                        ),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {(showAddGoal || selectedGoal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {selectedGoal ? "Edit Goal" : "Create New Goal"}
            </h2>
            <form
              onSubmit={selectedGoal ? handleEditGoal : handleAddGoal}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedGoal?.name || ""}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    defaultValue={selectedGoal?.targetAmount || ""}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                {selectedGoal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Amount
                    </label>
                    <input
                      type="number"
                      name="currentAmount"
                      defaultValue={selectedGoal?.currentAmount || 0}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  defaultValue={
                    selectedGoal?.deadline
                      ? new Date(selectedGoal.deadline)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={selectedGoal?.category || ""}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                  <option value="Home">Home</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Savings">Savings</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {selectedGoal ? "Update Goal" : "Create Goal"}
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
