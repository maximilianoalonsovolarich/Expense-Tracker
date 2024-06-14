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
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { fetchExpenses, addExpense, deleteExpense } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
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
        toast.error('Error al cargar los gastos');
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
      console.error('Error adding expense:', error);
      toast.error('Error al añadir el gasto');
    }
  };

  const handleDeleteExpense = async (id) => {
    const previousExpenses = expenses;
    setExpenses(expenses.filter((expense) => expense.id !== id));

    try {
      await deleteExpense(id);
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

  return (
    <Container maxWidth="lg" className="container">
      <CssBaseline />
      <ToastContainer position="top-right" />
      {expenses.length === 0 ? (
        <Box className="no-expenses-container">
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Añadir Gasto
            </Typography>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </Paper>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={8}>
            <ExpenseForm
              onAddExpense={handleAddExpense}
              className="form-container"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Dashboard;
