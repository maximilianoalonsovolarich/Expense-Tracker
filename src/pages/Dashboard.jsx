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
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { fetchExpenses, addExpense, deleteExpense } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    async function getExpenses() {
      try {
        const { expenses: expensesData, saldoInicial } = await fetchExpenses();
        setExpenses(expensesData);
        setSaldoInicial(saldoInicial);
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
      const updatedExpenses = [...expenses, ...newExpenses];
      setExpenses(updatedExpenses);
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

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filteredExpenses = filterDate
    ? expenses.filter(
        (expense) => new Date(expense.Fecha) <= new Date(filterDate)
      )
    : expenses;

  const totalIngreso = expenses
    .filter((expense) => expense.Ingreso)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const totalEgreso = expenses
    .filter((expense) => expense.Egreso)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const saldoActual = saldoInicial + totalIngreso - totalEgreso;

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
    <Container maxWidth="lg" className="container" sx={{ mt: 1 }}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mt: 1 }}>
          Dashboard de Gastos
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Total Ingreso: ${totalIngreso}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Total Egreso: ${totalEgreso}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Saldo Actual: ${saldoActual}
              </Typography>
              <TextField
                type="date"
                value={filterDate}
                onChange={handleFilterDateChange}
                fullWidth
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <ExpenseList
                expenses={filteredExpenses}
                onDeleteExpense={handleDeleteExpense}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
