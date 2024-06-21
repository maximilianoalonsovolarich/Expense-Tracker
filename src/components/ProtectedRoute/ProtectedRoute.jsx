// src/components/ProtectedRoute/ProtectedRoute.jsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS.split(',');

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (user && !allowedEmails.includes(user.email)) {
      setUnauthorized(true);
      toast.error('No tienes autorización para acceder a esta aplicación.');
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (unauthorized) {
    return (
      <>
        <Navigate to="/login" />
        <Dialog open={unauthorized} onClose={() => setUnauthorized(false)}>
          <DialogTitle>Sin autorización</DialogTitle>
          <DialogContent>
            No tienes autorización para acceder a esta aplicación. Solicita
            acceso al administrador.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUnauthorized(false)} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
