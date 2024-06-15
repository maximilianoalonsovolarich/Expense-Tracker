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
import { format, parseISO } from 'date-fns';

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
      const month = format(parseISO(expense.Fecha), 'yyyy-MM');
      if (!acc.ingresos[month]) {
        acc.ingresos[month] = 0;
      }
      if (!acc.egresos[month]) {
        acc.egresos[month] = 0;
      }
      if (expense.Ingreso) {
        acc.ingresos[month] += expense.Cantidad;
      }
      if (expense.Egreso) {
        acc.egresos[month] += expense.Cantidad;
      }
      return acc;
    },
    { ingresos: {}, egresos: {} }
  );

  const data = {
    labels: Object.keys(groupedExpenses.ingresos),
    datasets: [
      {
        label: 'Ingreso',
        data: Object.values(groupedExpenses.ingresos),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Egreso',
        data: Object.values(groupedExpenses.egresos),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Ingreso', 'Egreso'],
    datasets: [
      {
        label: 'Monto',
        data: [
          Object.values(groupedExpenses.ingresos).reduce((a, b) => a + b, 0),
          Object.values(groupedExpenses.egresos).reduce((a, b) => a + b, 0),
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
