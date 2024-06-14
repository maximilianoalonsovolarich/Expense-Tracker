// src/components/ErrorState.jsx
import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const ErrorState = () => (
  <Alert status="error">
    <AlertIcon />
    <AlertTitle>An error occurred!</AlertTitle>
    <AlertDescription>Please try again later.</AlertDescription>
  </Alert>
);

export default ErrorState;
