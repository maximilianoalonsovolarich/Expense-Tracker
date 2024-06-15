import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuario registrado exitosamente');
    } catch (error) {
      alert('Error al registrar usuario: ' + error.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Registrarse
        </Typography>
        <TextField
          fullWidth
          label="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Registrarse
        </Button>
      </Box>
    </Paper>
  );
}

export default Register;
