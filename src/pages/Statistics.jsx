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
import { fetchExpenses } from '../services/api';
import ExpenseCharts from '../components/ExpenseCharts';
import SmallLineChart from '../components/SmallLineChart';
import { saveAs } from 'file-saver';
import CountUp from 'react-countup';

function Statistics() {
  const [expenses, setExpenses] = useState([]);
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
    getExpenses();
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
      Ingreso: expense.Ingreso ? 'Sí' : 'No',
      Egreso: expense.Egreso ? 'Sí' : 'No',
    }));
    const csvContent = [
      ['Fecha', 'Cantidad', 'Categoría', 'Descripción', 'Ingreso', 'Egreso'],
      ...csvData.map((item) => [
        item.Fecha,
        item.Cantidad,
        item.Categoría,
        item.Descripción,
        item.Ingreso,
        item.Egreso,
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
                <MenuItem value="Alimentación">Alimentación</MenuItem>
                <MenuItem value="Transporte">Transporte</MenuItem>
                <MenuItem value="Entretenimiento">Entretenimiento</MenuItem>
                <MenuItem value="Sueldo">Sueldo</MenuItem>
                <MenuItem value="Merienda">Merienda</MenuItem>
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
            Total Ingreso:{' '}
            <CountUp end={totalIngreso} prefix="$" duration={1.5} />
          </Typography>
          <Typography variant="h6">
            Total Egreso:{' '}
            <CountUp end={totalEgreso} prefix="$" duration={1.5} />
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
        <ExpenseCharts
          expenses={filteredExpenses}
          saldoInicial={saldoInicial}
        />
        <Box sx={{ height: 100, mt: 2 }}>
          <SmallLineChart expenses={filteredExpenses} />
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics;
