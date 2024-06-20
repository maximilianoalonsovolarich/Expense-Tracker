import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';
import ExpenseCharts from '../components/ExpenseCharts/ExpenseCharts';
import useCache from '../hooks/useCache';
import { fetchExpenses, fetchCategories, deleteExpense } from '../services/api';
import TicketGrid from '../components/TicketGrid/TicketGrid';
import FiltersAndExport from '../components/FiltersAndExport/FiltersAndExport';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Statistics() {
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
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (cachedData && Array.isArray(cachedData.expenses)) {
      const sortedExpenses = cachedData.expenses.sort(
        (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
      );
      setExpenses(sortedExpenses);
    }
  }, [cachedData]);

  const [expenses, setExpenses] = useState([]);

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
      <Typography variant="h6" color="error">
        Error al cargar los datos: {error?.message || errorCategories?.message}
      </Typography>
    );
  }

  const handleDateFromChange = (event) => {
    setFilterDateFrom(event.target.value);
  };

  const handleDateToChange = (event) => {
    setFilterDateTo(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleExport = () => {
    const csvData = expenses.map((expense) => ({
      Fecha: expense.Fecha,
      Cantidad: expense.Cantidad,
      Categoría: expense.Categoría,
      Descripción: expense.Descripción,
      Ganancia: expense.Ganancia ? 'Sí' : 'No',
      Gasto: expense.Gasto ? 'Sí' : 'No',
    }));
    const csvContent = [
      ['Fecha', 'Cantidad', 'Categoría', 'Descripción', 'Ganancia', 'Gasto'],
      ...csvData.map((item) => [
        item.Fecha,
        item.Cantidad,
        item.Categoría,
        item.Descripción,
        item.Ganancia,
        item.Gasto,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'gastos.csv');
  };

  const filteredExpenses = cachedData.expenses
    .filter((expense) =>
      filterDateFrom
        ? new Date(expense.Fecha) >= new Date(filterDateFrom)
        : true
    )
    .filter((expense) =>
      filterDateTo ? new Date(expense.Fecha) <= new Date(filterDateTo) : true
    )
    .filter((expense) =>
      filterCategory ? expense.Categoría === filterCategory : true
    );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
  );

  const totalGanancia = sortedExpenses
    .filter((expense) => expense.Ganancia)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const totalGasto = sortedExpenses
    .filter((expense) => expense.Gasto)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const saldoInicial = cachedData.saldoInicial || 0;
  const saldoActual = saldoInicial + totalGanancia - totalGasto;

  return (
    <Container maxWidth="lg" className="container" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Estadísticas de Gastos
      </Typography>
      <FiltersAndExport
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        filterCategory={filterCategory}
        handleDateFromChange={handleDateFromChange}
        handleDateToChange={handleDateToChange}
        handleCategoryChange={handleCategoryChange}
        handleExport={handleExport}
        categories={cachedCategories}
      />
      <Paper
        elevation={3}
        sx={{ padding: 2, height: '100%', position: 'relative' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Total Ganancia:{' '}
            <CountUp end={totalGanancia} prefix="$" duration={1.5} />
          </Typography>
          <Typography variant="h6">
            Total Gasto: <CountUp end={totalGasto} prefix="$" duration={1.5} />
          </Typography>
          <Typography variant="h6">
            Saldo Actual:{' '}
            <CountUp
              end={saldoActual}
              prefix="$"
              duration={1.5}
              style={{ color: saldoActual < 0 ? 'red' : 'inherit' }}
            />
          </Typography>
        </Box>
        <ExpenseCharts expenses={sortedExpenses} saldoInicial={saldoInicial} />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tickets Cargados
          </Typography>
          <TicketGrid
            expenses={sortedExpenses}
            categories={cachedCategories}
            handleExport={handleExport}
            handleDeleteExpense={handleDeleteExpense}
          />
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics;
