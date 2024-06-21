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
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../hooks/useAuth';

const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS.split(',');

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error('Error de autenticación: ' + error.message);
    }
    if (user && !allowedEmails.includes(user.email) && !open) {
      setOpen(true);
      toast.error('No tienes autorización para acceder a esta aplicación.');
    }
  }, [user, error, open]);

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

  if (error) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedEmails.includes(user.email)) {
    return (
      <>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Sin autorización</DialogTitle>
          <DialogContent>
            No tienes autorización para acceder a esta aplicación. Solicita
            acceso al administrador.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <Navigate to="/login" replace />
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
