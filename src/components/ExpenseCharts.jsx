import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseCharts({ expenses = [] }) {
  const [filter, setFilter] = useState('Cantidad');

  const data = {
    labels: expenses.map((expense) => expense.fields.Fecha),
    datasets: [
      {
        label: filter,
        data: expenses.map((expense) => expense.fields[filter]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: expenses.map((expense) => expense.fields.Fecha),
    datasets: [
      {
        label: filter,
        data: expenses.map((expense) => expense.fields[filter]),
        backgroundColor: expenses.map(
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
      },
    ],
  };

  return (
    <Paper elevation={3} className="chart-container">
      <Typography variant="h6" className="chart-title">
        Gráficos de Gastos
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Filtro</InputLabel>
          <Select
            value={filter}
            label="Filtro"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="Cantidad">Cantidad</MenuItem>
            <MenuItem value="Ingreso">Ingreso</MenuItem>
            <MenuItem value="Egreso">Egreso</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} className="chart-grid-item">
          <Typography variant="h6" className="chart-title">
            Gráfico de Barras
          </Typography>
          <Bar data={data} />
        </Grid>
        <Grid item xs={12} md={6} className="chart-grid-item">
          <Typography variant="h6" className="chart-title">
            Gráfico Circular
          </Typography>
          <Box className="pie-chart-container">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ExpenseCharts;
