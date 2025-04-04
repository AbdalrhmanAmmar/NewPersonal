import { useEffect, useState, useMemo } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  QueryConstraint,
  OrderByDirection,
  FirestoreError,
} from "firebase/firestore";

// Define types for your filters and ordering
export interface FilterCondition {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export interface OrderCondition {
  field: string;
  direction?: OrderByDirection;
}

export function useCollection<T>(
  collectionName: string,
  filters: FilterCondition[] = [],
  orderByFields: OrderCondition[] = [],
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  // Memoize query constraints to prevent unnecessary recreations
  const queryConstraints = useMemo(() => {
    const constraints: QueryConstraint[] = [];

    filters.forEach(({ field, operator, value }) => {
      constraints.push(where(field, operator, value));
    });

    orderByFields.forEach(({ field, direction = "asc" }) => {
      constraints.push(orderBy(field, direction));
    });

    return constraints;
  }, [filters, orderByFields]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);

        const dataList: T[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(dataList);
      } catch (err) {
        setError(err as FirestoreError);
        console.error("Error fetching collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, queryConstraints, ...dependencies]);

  return { data, loading, error };
}
