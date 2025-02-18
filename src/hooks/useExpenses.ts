import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCollection } from './useCollection';
import { Expense } from '../lib/firebase';
import { useExpenseStore } from '../store/useExpenseStore';

export function useExpenses() {
  const { user } = useAuthStore();
  const { setExpenses, setLoading, setError } = useExpenseStore();
  
  const result = useCollection<Expense>(
    'expenses',
    [
      {
        field: 'userId',
        operator: '==',
        value: user?.uid
      }
    ],
    [{ field: 'date', direction: 'desc' }]
  );

  useEffect(() => {
    setLoading(result.loading);
    if (result.data) {
      setExpenses(result.data);
    }
    if (result.error) {
      setError(result.error);
    }
  }, [result.data, result.loading, result.error]);

  return result;
}