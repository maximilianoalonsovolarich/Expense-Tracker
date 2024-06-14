// src/components/ErrorFallback.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function ErrorFallback({ error, resetErrorBoundary }) {
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
