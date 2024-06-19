// src/hooks/useCache.js

import { useState, useEffect } from 'react';

const useCache = (key, fetchFunction, expiryTime = 3600000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key));
        const now = new Date().getTime();

        if (cachedData && now - cachedData.timestamp < expiryTime) {
          setData(cachedData.data);
        } else {
          const freshData = await fetchFunction();
          localStorage.setItem(
            key,
            JSON.stringify({ data: freshData, timestamp: now })
          );
          setData(freshData);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFunction, expiryTime]);

  return { data, loading, error };
};

export default useCache;
