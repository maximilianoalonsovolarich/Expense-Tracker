// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Container,
  CssBaseline,
  CircularProgress,
  Typography,
  Paper,
  TextField,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm/ExpenseForm';
import ExpenseList from '../components/ExpenseList/ExpenseList';
import SmallLineChart from '../components/ExpenseCharts/SmallLineChart';
import { fetchExpenses, addExpense, deleteExpense } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCache from '../hooks/useCache';

function Dashboard() {
  const {
    data: cachedData,
    loading,
    error,
    clearCache,
    updateCache,
  } = useCache('expenses', fetchExpenses);
  const [expenses, setExpenses] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [filterDate, setFilterDate] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (cachedData && Array.isArray(cachedData.expenses)) {
      const sortedExpenses = cachedData.expenses.sort(
        (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
      );
      setExpenses(sortedExpenses);
      setSaldoInicial(cachedData.saldoInicial || 0);
    }
  }, [cachedData]);

  const handleAddExpense = async (expense) => {
    try {
      const newExpenses = await addExpense(expense);
      const updatedExpenses = [...expenses, ...newExpenses].sort(
        (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
      );
      updateCache({ expenses: updatedExpenses, saldoInicial });
      toast.success('Gasto añadido exitosamente');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error al añadir el gasto');
    }
  };

  const handleDeleteExpense = async (id) => {
    const previousExpenses = expenses;
    setExpenses(expenses.filter((expense) => expense.id !== id));
    try {
      await deleteExpense(id);
      const updatedExpenses = previousExpenses.filter(
        (expense) => expense.id !== id
      );
      updateCache({ expenses: updatedExpenses, saldoInicial });
      toast.success('Gasto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting expense:', error);
      setExpenses(previousExpenses);
      toast.error('Error al eliminar el gasto');
    }
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

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

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error al cargar los gastos: {error.message}
      </Typography>
    );
  }

  const filteredExpenses = filterDate
    ? expenses.filter(
        (expense) => new Date(expense.Fecha) <= new Date(filterDate)
      )
    : expenses;

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
  );

  const totalGastos = sortedExpenses.length;

  const totalGanancia = sortedExpenses
    .filter((expense) => expense.Ganancia)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const totalGasto = sortedExpenses
    .filter((expense) => expense.Gasto)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const saldoActual = saldoInicial + totalGanancia - totalGasto;

  return (
    <Container maxWidth="lg" className="container" sx={{ mt: 0, pt: 2 }}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        {isMobile && (
          <Grid item xs={12}>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Grid container spacing={4} sx={{ height: '100%' }}>
            <Grid item xs={12} md={sortedExpenses.length === 0 ? 12 : 6}>
              <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: saldoActual < 0 ? 'error.main' : 'success.main',
                    backgroundColor:
                      saldoActual < 0
                        ? 'rgba(255, 99, 71, 0.1)'
                        : 'rgba(144, 238, 144, 0.1)',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  Total de Tickets: {totalGastos}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Ganancia: ${totalGanancia}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Gasto: ${totalGasto}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: saldoActual < 0 ? 'error.main' : 'text.primary',
                  }}
                >
                  Saldo Actual: ${saldoActual}
                </Typography>
                <TextField
                  type="date"
                  value={filterDate}
                  onChange={handleFilterDateChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 2 }}
                />
                <Box sx={{ height: 100, mt: 2 }}>
                  <SmallLineChart expenses={sortedExpenses} />
                </Box>
              </Paper>
            </Grid>
            {sortedExpenses.length > 0 && (
              <Grid item xs={12} md={6}>
                <ExpenseList
                  expenses={sortedExpenses}
                  onDeleteExpense={handleDeleteExpense}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {!isMobile && (
          <Grid item xs={12} md={6}>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
