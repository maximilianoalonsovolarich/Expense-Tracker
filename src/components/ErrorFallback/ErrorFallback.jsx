// src/components/ErrorFallback/ErrorFallback.jsx

import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      // Aquí puedes añadir condiciones para diferentes tipos de errores si lo deseas
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <Box role="alert" textAlign="center" mt={5}>
      <Typography variant="h4" color="error">
        Something went wrong:
      </Typography>
      <Typography variant="body1">{error.message}</Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
}

export default ErrorFallback;
