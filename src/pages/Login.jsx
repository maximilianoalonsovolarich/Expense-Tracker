import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Divider,
} from '@mui/material';
import { signInWithGoogle } from '../services/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, textAlign: 'center' }}>
        <ToastContainer />
        <Typography variant="h4" gutterBottom>
          Bienvenido App de Gastos
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ py: 1.5, mb: 2, fontSize: '1rem' }}
        >
          Iniciar Sesión con Google
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;
