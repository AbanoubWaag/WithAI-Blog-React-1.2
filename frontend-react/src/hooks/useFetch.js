import { useState, useEffect } from "react";
import api from "../api/axios";

// Custom hook — covers: useState, useEffect, custom hooks
const useFetch = (url) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(url);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.msg || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    // Cleanup — covers: useEffect cleanup
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
