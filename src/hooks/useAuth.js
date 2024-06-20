// src/hooks/useAuth.js

import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useEffect } from 'react';

const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  return { user, loading, error };
};

export default useAuth;
