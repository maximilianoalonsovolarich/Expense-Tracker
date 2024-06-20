// src/components/ErrorRedirect/ErrorRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};

export default ErrorRedirect;
