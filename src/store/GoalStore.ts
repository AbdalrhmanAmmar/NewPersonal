import { create } from "zustand";
import { db, COLLECTIONS, Goal } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

interface GoalsStore {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  setGoals: (goals: Goal[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchGoals: (userId: string) => Promise<void>;
  createGoal: (
    goal: Omit<Goal, "id" | "createdAt" | "updatedAt">
  ) => Promise<string>;
  updateGoal: (goalId: string, updatedGoal: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string, userId: string) => Promise<void>;
  getGoalById: (goalId: string) => Goal | undefined;
}

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  setGoals: (goals) => set({ goals }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchGoals: async (userId) => {
    set({ loading: true, error: null });
    try {
      const goalsCollection = collection(db, COLLECTIONS.GOALS);
      const q = query(goalsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userGoals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Goal),
      }));

      set({ goals: userGoals });
    } catch (error) {
      console.error("Error fetching goals:", error);
      set({
        error: error instanceof Error ? error.message : "Error fetching goals",
      });
    } finally {
      set({ loading: false });
    }
  },

  createGoal: async (goal) => {
    set({ loading: true, error: null });
    try {
      if (!goal.userId) {
        throw new Error("User ID is required to create a goal");
      }

      const goalWithTimestamps = {
        ...goal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, COLLECTIONS.GOALS),
        goalWithTimestamps
      );

      // Optimistically update local state
      set((state) => ({
        goals: [...state.goals, { ...goalWithTimestamps, id: docRef.id }],
      }));

      return docRef.id;
    } catch (error) {
      console.error("Error creating goal:", error);
      set({
        error: error instanceof Error ? error.message : "Error creating goal",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateGoal: async (goalId, updatedGoal) => {
    set({ loading: true, error: null });
    try {
      const goalRef = doc(db, COLLECTIONS.GOALS, goalId);

      await updateDoc(goalRef, {
        ...updatedGoal,
        updatedAt: serverTimestamp(),
      });

      // Optimistically update local state
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === goalId ? { ...goal, ...updatedGoal } : goal
        ),
      }));
    } catch (error) {
      console.error("Error updating goal:", error);
      set({
        error: error instanceof Error ? error.message : "Error updating goal",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteGoal: async (goalId, userId) => {
    set({ loading: true, error: null });
    try {
      const goalRef = doc(db, COLLECTIONS.GOALS, goalId);
      await deleteDoc(goalRef);

      // Optimistically update local state
      set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== goalId),
      }));
    } catch (error) {
      console.error("Error deleting goal:", error);
      set({
        error: error instanceof Error ? error.message : "Error deleting goal",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getGoalById: (goalId) => {
    return get().goals.find((goal) => goal.id === goalId);
  },
}));
