import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Asegúrate de que este hook retorna el usuario y el estado de carga
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { toast } from 'react-toastify';

const allowedEmails = process.env.REACT_APP_ALLOWED_EMAILS.split(',');

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (allowedEmails.includes(user.email)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        toast.error("No tienes autorización para acceder a esta aplicación.");
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>; // O algún otro componente de carga
  }

  if (!user || !isAuthorized) {
    return (
      <>
        <Navigate to="/login" replace />
        <Dialog open={!isAuthorized} onClose={() => {}}>
          <DialogTitle>Sin autorización</DialogTitle>
          <DialogContent>
            No tienes autorización para acceder a esta aplicación. Solicita acceso al administrador.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {}}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
