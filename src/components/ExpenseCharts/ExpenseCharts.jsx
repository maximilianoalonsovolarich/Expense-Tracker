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
import { format, parseISO, isValid } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseCharts({ expenses = [], saldoInicial = 0 }) {
  const groupedExpenses = expenses.reduce(
    (acc, expense) => {
      const date = parseISO(expense.Fecha);
      if (!isValid(date)) {
        console.error(`Fecha inválida: ${expense.Fecha}`);
        return acc;
      }
      const month = format(date, 'yyyy-MM');
      if (!acc.ganancias[month]) {
        acc.ganancias[month] = 0;
      }
      if (!acc.gastos[month]) {
        acc.gastos[month] = 0;
      }
      if (expense.Ganancia) {
        acc.ganancias[month] += expense.Cantidad;
      }
      if (expense.Gasto) {
        acc.gastos[month] += expense.Cantidad;
      }
      return acc;
    },
    { ganancias: {}, gastos: {} }
  );

  const data = {
    labels: Object.keys(groupedExpenses.ganancias),
    datasets: [
      {
        label: 'Ganancia',
        data: Object.values(groupedExpenses.ganancias),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gasto',
        data: Object.values(groupedExpenses.gastos),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Ganancia', 'Gasto'],
    datasets: [
      {
        label: 'Monto',
        data: [
          Object.values(groupedExpenses.ganancias).reduce((a, b) => a + b, 0),
          Object.values(groupedExpenses.gastos).reduce((a, b) => a + b, 0),
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
