import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import useCache from '../hooks/useCache';
import {
  fetchExpenses,
  fetchCategories,
  addExpense,
  deleteExpense,
} from '../services/api';
import TicketGrid from '../components/TicketGrid/TicketGrid';
import ExpenseForm from '../components/ExpenseForm/ExpenseForm';
import ExpenseSummaryBar from '../components/ExpenseSummaryBar/ExpenseSummaryBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const {
    data: cachedData,
    loading,
    error,
    updateCache,
  } = useCache('expenses', fetchExpenses);
  const {
    data: cachedCategories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCache('categories', fetchCategories);
  const [expenses, setExpenses] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [lastLoadedId, setLastLoadedId] = useState(null);

  useEffect(() => {
    if (cachedData && Array.isArray(cachedData.expenses)) {
      setExpenses(cachedData.expenses);
      setSaldoInicial(cachedData.saldoInicial || 0);
    }
  }, [cachedData]);

  const handleAddExpense = async (expense) => {
    try {
      const newExpenses = await addExpense(expense);
      const updatedExpenses = [...expenses, ...newExpenses];
      updateCache({ expenses: updatedExpenses, saldoInicial });
      setExpenses(updatedExpenses);
      setLastLoadedId(newExpenses[0].id); // Establecer la ID del último cargado
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
      updateCache({ expenses: updatedExpenses });
      toast.success('Gasto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting expense:', error);
      setExpenses(previousExpenses);
      toast.error('Error al eliminar el gasto');
    }
  };

  const totalGastos = expenses.length;
  const totalGanancia = expenses
    .filter((expense) => expense.Ganancia)
    .reduce((total, expense) => total + expense.Cantidad, 0);
  const totalGasto = expenses
    .filter((expense) => expense.Gasto)
    .reduce((total, expense) => total + expense.Cantidad, 0);
  const saldoActual = saldoInicial + totalGanancia - totalGasto;

  if (loading || loadingCategories) {
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

  if (error || errorCategories) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error al cargar los gastos: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <ToastContainer position="top-right" />
      <ExpenseSummaryBar
        totalGastos={totalGastos}
        totalGanancia={totalGanancia}
        totalGasto={totalGasto}
        saldoActual={saldoActual}
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ExpenseForm onAddExpense={handleAddExpense} />
        </Grid>
        <Grid item xs={12}>
          <TicketGrid
            expenses={expenses}
            handleDeleteExpense={handleDeleteExpense}
            categories={cachedCategories}
            lastLoadedId={lastLoadedId} // Pasar la ID del último cargado
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
