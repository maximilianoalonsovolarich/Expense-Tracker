import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  TextField,
} from '@mui/material';
import { fetchExpenses, fetchCategories } from '../services/api';
import ExpenseCharts from '../components/ExpenseCharts/ExpenseCharts';
import SmallLineChart from '../components/ExpenseCharts/SmallLineChart';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';

function Statistics() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    async function getExpenses() {
      try {
        const { expenses: expensesData, saldoInicial } = await fetchExpenses();
        setExpenses(expensesData);
        setSaldoInicial(saldoInicial);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    }
    async function getCategories() {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    getExpenses();
    getCategories();
  }, []);

  const handleDateChange = (event) => {
    setFilterDate(event.target.value);
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

  const filteredExpenses = expenses
    .filter((expense) =>
      filterDate ? new Date(expense.Fecha) <= new Date(filterDate) : true
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

  const saldoActual = saldoInicial + totalGanancia - totalGasto;

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
    <Container maxWidth="lg" className="container" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Estadísticas de Gastos
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filtrar por Fecha"
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel htmlFor="filter-category">Categoría</InputLabel>
              <Select
                value={filterCategory}
                onChange={handleCategoryChange}
                label="Categoría"
                inputProps={{
                  name: 'filter-category',
                  id: 'filter-category',
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button variant="contained" color="primary" onClick={handleExport}>
              Exportar a CSV
            </Button>
          </Grid>
        </Grid>
      </Box>
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
