import { useEffect, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { useCollection } from "./useCollection";
import { Expense } from "../lib/firebase";
import { useExpenseStore } from "../store/useExpenseStore";
import { isEqual } from "lodash-es"; // or implement a simple deep comparison

export function useExpenses() {
  const { user } = useAuthStore();
  const expenseStore = useExpenseStore();

  // Memoize filters to prevent unnecessary recreations
  const filters = useMemo(
    () =>
      user?.uid ? [{ field: "userId", operator: "==", value: user.uid }] : [],
    [user?.uid]
  );

  const orderByFields = useMemo(
    () => [{ field: "date", direction: "desc" as const }],
    []
  );

  const result = useCollection<Expense>("expenses", filters, orderByFields, [
    user?.uid,
  ]);

  // Effect to sync with expense store
  useEffect(() => {
    expenseStore.setLoading(result.loading);

    if (result.data) {
      // Only update if data actually changed
      if (!isEqual(expenseStore.expenses, result.data)) {
        expenseStore.setExpenses(result.data);
      }
    } else if (!result.loading) {
      expenseStore.setExpenses([]);
    }

    if (result.error) {
      expenseStore.setError(result.error);
    }
  }, [result.loading, result.data, result.error, expenseStore]);

  // Optional: Clean up on unmount
  useEffect(() => {
    return () => {
      expenseStore.setLoading(false);
      expenseStore.setError(null);
    };
  }, [expenseStore]);

  return {
    expenses: result.data || [],
    loading: result.loading,
    error: result.error,
    refresh: () => {
      // You would need to modify useCollection to expose a refresh capability
      // This is just a placeholder for the concept
    },
  };
}
