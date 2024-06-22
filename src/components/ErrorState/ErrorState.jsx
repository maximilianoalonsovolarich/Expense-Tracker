import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import './ErrorState.css';

const ErrorState = () => (
  <Alert severity="error">
    <AlertTitle>An error occurred!</AlertTitle>
    Please try again later.
  </Alert>
);

export default ErrorState;
