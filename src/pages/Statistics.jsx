// src/pages/Statistics.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  CssBaseline,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ExpenseCharts from '../components/ExpenseCharts';
import { fetchExpenses } from '../services/api';

function Statistics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expensesData = await fetchExpenses();
        setExpenses(expensesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    }
    getExpenses();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="container">
      <CssBaseline />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Estadísticas de Gastos
        </Typography>
        <ExpenseCharts expenses={expenses} />
      </Box>
    </Container>
  );
}

export default Statistics;
