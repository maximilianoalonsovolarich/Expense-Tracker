import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS.split(',');

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !allowedEmails.includes(user.email)) {
      setOpen(true);
      toast.error('No tienes autorización para acceder a esta aplicación.');
    }
  }, [user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedEmails.includes(user.email)) {
    return (
      <>
        <Navigate to="/login" />
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
      </>
    );
  }

  return children;
}

export default ProtectedRoute;
