// src/hooks/useAuth.js

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  return { user, loading, error };
};

export default useAuth;
