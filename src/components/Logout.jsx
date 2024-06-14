// src/components/Logout.jsx
import React from 'react';
import { Button } from '@mui/material';
import { logOut } from '../firebase';

function Logout() {
  const handleLogout = async () => {
    try {
      await logOut();
      alert('Cierre de sesión exitoso');
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  return (
    <Button color="secondary" variant="contained" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}

export default Logout;
