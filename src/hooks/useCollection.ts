import { useEffect, useState } from "react";
import { db } from "../lib/firebase"; // Import your firestore instance
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export function useCollection<T>(collectionName: string, filters: any[], orderByFields: any[]) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let ref = collection(db, collectionName);

        // Apply filters if there are any
        filters.forEach((filter) => {
          ref = query(ref, where(filter.field, filter.operator, filter.value));
        });

        // Apply orderBy if there are any
        orderByFields.forEach((field) => {
          ref = query(ref, orderBy(field.field, field.direction));
        });

        const querySnapshot = await getDocs(ref);
        const dataList: T[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        setData(dataList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, filters, orderByFields]);

  return { data, loading, error };
}
