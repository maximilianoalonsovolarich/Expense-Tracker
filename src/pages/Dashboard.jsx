import React, { useState, useEffect } from 'react';
import { fetchExpenses, addExpense, deleteExpense } from '../services/api';
import {
  Box,
  Grid,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import { logOut } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses();
        setExpenses(expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
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

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Cierre de sesión exitoso');
    } catch (error) {
      toast.error('Error al cerrar sesión: ' + error.message);
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
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h5">Dashboard</Typography>
        <Button color="secondary" variant="contained" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
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
    </Container>
  );
}

export default Dashboard;
