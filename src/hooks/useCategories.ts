import { useEffect } from 'react';
import { Category } from '../lib/firebase';
import { useCollection } from './useCollection';
import { useAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/useCategoryStore';

export function useCategories() {
  const { user } = useAuthStore();
  const { setCategories, setLoading, setError } = useCategoryStore();
  
  const result = useCollection<Category>(
    'categories',
    [
      {
        field: 'userId',
        operator: '==',
        value: user?.uid
      }
    ],
    [{ field: 'name', direction: 'asc' }]
  );

  useEffect(() => {
    setLoading(result.loading);
    if (result.data) {
      setCategories(result.data);
    }
    if (result.error) {
      setError(result.error);
    }
  }, [result.data, result.loading, result.error]);

  return result;
}