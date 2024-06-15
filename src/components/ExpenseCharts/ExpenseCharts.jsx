import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Box, Paper, Typography, Grid } from '@mui/material';
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

function ExpenseCharts({ expenses = [], saldoInicial = 0 }) {
  const ingresos = expenses
    .filter((expense) => expense.Ingreso)
    .map((expense) => expense.Cantidad);
  const egresos = expenses
    .filter((expense) => expense.Egreso)
    .map((expense) => expense.Cantidad);

  const data = {
    labels: ['Ingreso', 'Egreso'],
    datasets: [
      {
        label: 'Monto',
        data: [
          ingresos.reduce((total, cantidad) => total + cantidad, 0),
          egresos.reduce((total, cantidad) => total + cantidad, 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const pieData = {
    labels: ['Ingreso', 'Egreso'],
    datasets: [
      {
        label: 'Monto',
        data: [
          ingresos.reduce((total, cantidad) => total + cantidad, 0),
          egresos.reduce((total, cantidad) => total + cantidad, 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <Paper elevation={3} className="chart-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} className="chart-grid-item">
          <Typography variant="h6" className="chart-title">
            Gráfico de Barras
          </Typography>
          <Bar data={data} />
        </Grid>
        <Grid item xs={12} md={6} className="chart-grid-item">
          <Box className="pie-chart-container">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ExpenseCharts;
