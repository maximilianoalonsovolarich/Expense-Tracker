import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchExpenses, addExpense, deleteExpense } from '../api';
import Header from '../components/Header';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses();
        setExpenses(expenses);
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    getExpenses();
  }, []);

  const handleAddExpense = async (expense) => {
    try {
      const newExpenses = await addExpense(expense);
      setExpenses([...expenses, ...newExpenses]);
      toast.success('Gasto añadido exitosamente');
    } catch (error) {
      toast.error('Error al añadir gasto');
    }
  };

  const handleDeleteExpense = async (id) => {
    const previousExpenses = expenses;
    setExpenses(expenses.filter((expense) => expense.id !== id));

    try {
      await deleteExpense(id);
      toast.success('Gasto eliminado exitosamente');
    } catch (error) {
      setExpenses(previousExpenses);
      toast.error('Error al eliminar gasto');
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

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Header />
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExpenseForm onAddExpense={handleAddExpense} />
          <ExpenseChart expenses={expenses} />
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default Dashboard;
