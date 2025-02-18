import { create } from "zustand";
import { Expense } from "../lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Timestamp } from "firebase/firestore";

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
          amount: data.amount,
          description: data.description,
          category: data.category, // Now a string
          date: data.date.toDate(), // Convert Firestore Timestamp to Date
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
      const newExpense = {
        ...expense,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "expenses"), newExpense);
      set((state) => ({
        expenses: [{ ...newExpense, id: docRef.id } as Expense, ...state.expenses],
      }));
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  updateExpense: async (id, updatedExpense) => {
    try {
      const expenseRef = doc(db, "expenses", id);
      const updatedData = {
        ...updatedExpense,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(expenseRef, updatedData);

      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id ? { ...expense, ...updatedData } : expense
        ),
      }));
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  removeExpense: async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },
}));
