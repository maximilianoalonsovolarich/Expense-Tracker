import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import './ErrorState.css';

const ErrorState = () => (
  <Alert status="error">
    <AlertIcon />
    <AlertTitle>An error occurred!</AlertTitle>
    <AlertDescription>Please try again later.</AlertDescription>
  </Alert>
);

export default ErrorState;
