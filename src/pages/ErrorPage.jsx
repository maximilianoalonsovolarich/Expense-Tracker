// src/pages/ErrorPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Error 404
        </Typography>
        <Typography variant="body1" gutterBottom>
          The page you are looking for does not exist. Redirecting to
          homepage...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
