import { useEffect, useMemo, useCallback } from "react";
import { Goal } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import { useCollection } from "./useCollection";
import { useGoalsStore } from "../store/GoalStore";
import { isEqual } from "lodash-es";

export function useGoals() {
  const { user } = useAuthStore();
  const { setGoals, setLoading, setError, goals, fetchGoals } = useGoalsStore();

  // Memoize filters to prevent unnecessary recreations
  const filters = useMemo(
    () =>
      user?.uid ? [{ field: "userId", operator: "==", value: user.uid }] : [],
    [user?.uid]
  );

  const orderByFields = useMemo(
    () => [{ field: "createdAt", direction: "desc" as const }],
    []
  );

  const { data, loading, error } = useCollection<Goal>(
    "goals",
    user?.uid ? [{ field: "userId", operator: "==", value: user.uid }] : [],
    [{ field: "createdAt", direction: "desc" }],
    [user?.uid] // إعادة الجلب عند تغيير userId
  );

  // Improved sync with store
  useEffect(() => {
    setLoading(loading);
    setError(error ?? null); // Ensure error is cleared when there's none

    if (data && !loading && !error) {
      // Only update if data actually changed
      if (!isEqual(goals, data)) {
        setGoals(data);
      }
    }
  }, [data, loading, error, setGoals, setLoading, setError, goals]);

  // Add manual refresh capability
  const refresh = useCallback(() => {
    if (user?.uid) {
      fetchGoals(user.uid);
    }
  }, [user?.uid, fetchGoals]);

  return {
    goals: goals ?? [], // Ensure always an array
    loading,
    error,
    refresh, // Expose refresh function
  };
}
