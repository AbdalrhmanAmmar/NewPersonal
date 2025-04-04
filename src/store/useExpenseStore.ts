import { create } from "zustand";
import { Expense } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  setExpenses: (expenses: Expense[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchExpenses: (userId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: false,
  error: null,

  setExpenses: (expenses) => set({ expenses }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchExpenses: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const expensesRef = collection(db, "expenses");
      const q = query(expensesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const expensesList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: data.date.toDate(),
          paymentMethod: data.paymentMethod,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Expense;
      });

      set({ expenses: expensesList, loading: false });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      set({ error: "Failed to fetch expenses", loading: false });
    }
  },

  addExpense: async (expense) => {
    try {
      set({ loading: true, error: null });

      const expenseData = {
        ...expense,
        date: Timestamp.fromDate(new Date(expense.date)),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      const expensesRef = collection(db, "expenses");
      const docRef = await addDoc(expensesRef, expenseData);

      const newExpense = {
        id: docRef.id,
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        expenses: [...state.expenses, newExpense as Expense],
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding expense:", error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateExpense: async (id, updatedExpense) => {
    try {
      set({ loading: true, error: null });

      const expenseRef = doc(db, "expenses", id);
      const updateData = {
        ...updatedExpense,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      if (updateData.date) {
        updateData.date = Timestamp.fromDate(new Date(updateData.date));
      }

      await updateDoc(expenseRef, updateData);

      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id
            ? {
                ...expense,
                ...updatedExpense,
                updatedAt: new Date(),
              }
            : expense
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating expense:", error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  removeExpense: async (id) => {
    try {
      set({ loading: true, error: null });
      const expenseRef = doc(db, "expenses", id);
      await deleteDoc(expenseRef);

      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Error removing expense:", error);
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
