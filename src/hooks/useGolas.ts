import { useEffect } from 'react';
import { Goal } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useCollection } from './useCollection';  // Ensure this hook is defined correctly
import { useGoalsStore } from '../store/GoalStore';

export function useGoals() {
  const { user } = useAuthStore();
  const { setGoals, setLoading, setError, goals } = useGoalsStore();  // Ensure you're also fetching goals from the store
  
  const result = useCollection<Goal>(
    'goals',
    [
      {
        field: 'userId',
        operator: '==',
        value: user?.uid
      }
    ],
    [{ field: 'createdAt', direction: 'desc' }]
  );

  useEffect(() => {
    setLoading(result.loading);
    if (result.data) {
      setGoals(result.data); // Update the goals in the store
    }
    if (result.error) {
      setError(result.error); // Handle errors
    }
  }, [result.data, result.loading, result.error]);

  return { goals, loading: result.loading, error: result.error }; // Return goals for the component
}
