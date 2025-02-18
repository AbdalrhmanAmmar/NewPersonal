import { create } from 'zustand';
import { Expense } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: Error | null;
  setExpenses: (expenses: Expense[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: true,
  error: null,
  setExpenses: (expenses) => set({ expenses }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addExpense: async (expense) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), expense);
      set((state) => ({ 
        expenses: [{ ...expense, id: docRef.id } as Expense, ...state.expenses] 
      }));
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },
  updateExpense: (id, updatedExpense) => set((state) => ({
    expenses: state.expenses.map((expense) =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ),
  })),
  removeExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((expense) => expense.id !== id),
  })),
}));