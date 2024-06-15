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
} from '@mui/material';
import { fetchExpenses } from '../services/api';
import ExpenseCharts from '../components/ExpenseCharts';
import SmallLineChart from '../components/SmallLineChart'; // Importar el nuevo componente
import { saveAs } from 'file-saver';

function Statistics() {
  const [expenses, setExpenses] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Cantidad');

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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
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
      {' '}
      {/* Reduce top margin */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 2 }}>
        {' '}
        {/* Reduce bottom margin */}
        Estadísticas de Gastos
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filtro</InputLabel>
          <Select value={filter} label="Filtro" onChange={handleFilterChange}>
            <MenuItem value="Cantidad">Cantidad</MenuItem>
            <MenuItem value="Ingreso">Ingreso</MenuItem>
            <MenuItem value="Egreso">Egreso</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleExport}>
          Exportar a CSV
        </Button>
      </Box>
      <Paper
        elevation={3}
        sx={{ padding: 2, height: '100%', position: 'relative' }}
      >
        <ExpenseCharts
          expenses={expenses.filter((expense) => expense[filter] !== undefined)}
          saldoInicial={saldoInicial}
        />
        <Box sx={{ height: 100, mt: 2 }}>
          {' '}
          {/* Ajusta el tamaño según sea necesario */}
          <SmallLineChart
            expenses={expenses.filter(
              (expense) => expense[filter] !== undefined
            )}
          />
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics;
