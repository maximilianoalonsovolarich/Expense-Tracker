import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper } from '@mui/material';
import { signInWithGoogle } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Inicio de sesión exitoso');
      navigate('/'); // Redirige al Dashboard después de un inicio de sesión exitoso
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
        <ToastContainer />
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Iniciar Sesión con Google
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
