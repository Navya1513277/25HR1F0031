import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications({ filter, page }) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchNotifications({ filter, page });

        if (!isMounted) {
          return;
        }

        setNotifications(data.notifications ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load notifications");
          setNotifications([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [filter, page]);

  return { notifications, total, totalPages, loading, error };
}
