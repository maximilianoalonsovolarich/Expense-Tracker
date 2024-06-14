import React, { useState } from 'react';
import { addExpense, deleteExpense } from '../services/api';
import {
  Box,
  Grid,
  Container,
  CssBaseline,
  Typography,
  Button,
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { logOut } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard({ expenses }) {
  const [localExpenses, setLocalExpenses] = useState(expenses);

  const handleAddExpense = async (expense) => {
    try {
      const newExpenses = await addExpense(expense);
      setLocalExpenses([...localExpenses, ...newExpenses]);
      toast.success('Gasto añadido exitosamente');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error al añadir el gasto');
    }
  };

  const handleDeleteExpense = async (id) => {
    const previousExpenses = localExpenses;
    setLocalExpenses(localExpenses.filter((expense) => expense.id !== id));

    try {
      await deleteExpense(id);
      toast.success('Gasto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting expense:', error);
      setLocalExpenses(previousExpenses);
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

  return (
    <Container maxWidth="lg" className="container">
      <CssBaseline />
      <ToastContainer position="top-right" />
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
          <ExpenseForm
            onAddExpense={handleAddExpense}
            className="form-container"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExpenseList
            expenses={localExpenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
