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
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm/ExpenseForm';
import ExpenseList from '../components/ExpenseList/ExpenseList';
import ExpenseSummaryBar from '../components/ExpenseSummaryBar/ExpenseSummaryBar';
import { fetchExpenses, addExpense, deleteExpense } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCache from '../hooks/useCache';
import ExpenseCharts from '../components/ExpenseCharts/ExpenseCharts';
import SmallLineChart from '../components/ExpenseCharts/SmallLineChart';

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

  return (
    <Container maxWidth="lg" className="container" sx={{ mt: 0, pt: 2 }}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <ExpenseSummaryBar
        totalGastos={expenses.length}
        totalGanancia={expenses.reduce(
          (sum, expense) => (expense.Ganancia ? sum + expense.Cantidad : sum),
          0
        )}
        totalGasto={expenses.reduce(
          (sum, expense) => (expense.Gasto ? sum + expense.Cantidad : sum),
          0
        )}
        saldoActual={
          saldoInicial +
          expenses.reduce(
            (sum, expense) => (expense.Ganancia ? sum + expense.Cantidad : sum),
            0
          ) -
          expenses.reduce(
            (sum, expense) => (expense.Gasto ? sum + expense.Cantidad : sum),
            0
          )
        }
      />
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <ExpenseForm onAddExpense={handleAddExpense} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Gráfico de Barras
              </Typography>
              <ExpenseCharts expenses={expenses} saldoInicial={saldoInicial} />
            </Paper>
            <Paper
              elevation={3}
              sx={{ p: 2, height: '350px', overflow: 'hidden' }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Saldo Quincenal
              </Typography>
              <Box sx={{ height: 'calc(100% - 32px)', width: '100%' }}>
                <SmallLineChart expenses={expenses} />
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
