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
} from '@mui/material';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SmallLineChart from '../components/SmallLineChart';
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

  const totalGastos = filteredExpenses.length;

  const totalIngreso = filteredExpenses
    .filter((expense) => expense.Ingreso)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const totalEgreso = filteredExpenses
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
    <Container maxWidth="lg" className="container" sx={{ mt: 0, pt: 2 }}>
      <CssBaseline />
      <ToastContainer position="top-right" />
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Dashboard de Gastos
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={4} sx={{ height: '100%' }}>
            <Grid item xs={12} md={filteredExpenses.length === 0 ? 12 : 6}>
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
                  Total de Gastos: {totalGastos}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Ingreso: ${totalIngreso}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total Egreso: ${totalEgreso}
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
                  {' '}
                  {/* Ajusta el tamaño según sea necesario */}
                  <SmallLineChart expenses={filteredExpenses} />
                </Box>
              </Paper>
            </Grid>
            {filteredExpenses.length > 0 && (
              <Grid item xs={12} md={6}>
                <ExpenseList
                  expenses={filteredExpenses}
                  onDeleteExpense={handleDeleteExpense}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpenseForm onAddExpense={handleAddExpense} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
