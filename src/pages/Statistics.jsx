// src/pages/Statistics.jsx

import React, { useState } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';
import ExpenseCharts from '../components/ExpenseCharts/ExpenseCharts';
import SmallLineChart from '../components/ExpenseCharts/SmallLineChart';
import ExpenseFilters from '../components/ExpenseFilters/ExpenseFilters';
import ExpenseSummaryBar from '../components/ExpenseSummaryBar/ExpenseSummaryBar';
import useCache from '../hooks/useCache';
import { fetchExpenses, fetchCategories } from '../services/api';

function Statistics() {
  const {
    data: cachedData,
    loading: loadingExpenses,
    error: errorExpenses,
  } = useCache('expenses', fetchExpenses);

  const {
    data: cachedCategories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCache('categories', fetchCategories);

  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  if (loadingExpenses || loadingCategories) {
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

  if (errorExpenses || errorCategories) {
    return (
      <Typography variant="h6" color="error">
        Error al cargar los datos:{' '}
        {errorExpenses?.message || errorCategories?.message}
      </Typography>
    );
  }

  const handleStartDateChange = (event) => {
    setFilterStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setFilterEndDate(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const handleExport = () => {
    const csvData = cachedData.expenses.map((expense) => ({
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

  const filteredExpenses = (cachedData.expenses || [])
    .filter((expense) =>
      filterStartDate
        ? new Date(expense.Fecha) >= new Date(filterStartDate)
        : true
    )
    .filter((expense) =>
      filterEndDate ? new Date(expense.Fecha) <= new Date(filterEndDate) : true
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
      <ExpenseSummaryBar
        totalGastos={sortedExpenses.length}
        totalGanancia={totalGanancia}
        totalGasto={totalGasto}
        saldoActual={saldoActual}
      />
      <ExpenseFilters
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        filterCategory={filterCategory}
        categories={cachedCategories || []}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        handleCategoryChange={handleCategoryChange}
        handleExport={handleExport}
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
        <Box sx={{ height: 100, mt: 2 }}>
          <SmallLineChart expenses={sortedExpenses} />
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics;
