import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ExpenseChart({ expenses }) {
  const data = {
    labels: expenses.map((expense) => expense.fields.Fecha),
    datasets: [
      {
        label: 'Gastos',
        data: expenses.map((expense) => expense.fields.Cantidad),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Bar data={data} />
    </Box>
  );
}

export default ExpenseChart;
