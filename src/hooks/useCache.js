// src/hooks/useCache.js

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useCache = (key, fetchFunction, expiryTime = 3600000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, [key, fetchFunction, expiryTime]);

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  const clearCache = () => {
    localStorage.removeItem(key);
    setData(null);
    setLoading(true);
    fetchData();
  };

  const updateCache = (newData) => {
    const now = new Date().getTime();
    localStorage.setItem(
      key,
      JSON.stringify({ data: newData, timestamp: now })
    );
    setData(newData);
  };

  return { data, loading, error, clearCache, updateCache };
};

export default useCache;
