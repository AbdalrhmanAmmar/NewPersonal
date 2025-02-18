import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useCollection } from "./useCollection";
import { Expense } from "../lib/firebase";
import { useExpenseStore } from "../store/useExpenseStore";

export function useExpenses() {
  const { user } = useAuthStore();
  const expenseStore = useExpenseStore();

  const result = useCollection<Expense>(
    "expenses",
    user?.uid
      ? [{ field: "userId", operator: "==", value: user.uid }]
      : [], // Prevents running the query when user is not available
    [{ field: "date", direction: "desc" }]
  );

  useEffect(() => {
    expenseStore.setLoading(result.loading);

    if (result.data) {
      expenseStore.setExpenses(result.data);
    } else if (!result.loading) {
      expenseStore.setExpenses([]); // Ensure state resets if no data is found
    }

    if (result.error) {
      expenseStore.setError(result.error);
    }
  }, [JSON.stringify(result)]); // Ensures effect only runs when result changes significantly

  return result;
}
