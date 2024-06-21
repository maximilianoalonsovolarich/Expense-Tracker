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
  const { user, loading } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // Se actualiza el estado de autorización solo cuando el usuario está definido
    if (user) {
      if (!allowedEmails.includes(user.email)) {
        setUnauthorized(true);
        toast.error('No tienes autorización para acceder a esta aplicación.');
      } else {
        setUnauthorized(false);
      }
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
    // Redirecciona al login si no hay usuario autenticado
    return <Navigate to="/login" />;
  }

  if (unauthorized) {
    // Redirecciona y muestra el diálogo de no autorizado
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
