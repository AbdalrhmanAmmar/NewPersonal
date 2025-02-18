import { create } from 'zustand';
import { Category } from '../lib/firebase';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: true,
  error: null,
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addCategory: (category) => set((state) => ({ 
    categories: [category, ...state.categories] 
  })),
  updateCategory: (id, updatedCategory) => set((state) => ({
    categories: state.categories.map((category) =>
      category.id === id ? { ...category, ...updatedCategory } : category
    ),
  })),
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter((category) => category.id !== id),
  })),
}));