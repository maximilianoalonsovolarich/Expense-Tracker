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
import './ExpensePieChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({ expenses }) {
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

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, backgroundColor: '#FFFFFF', marginTop: 3 }}
    >
      <Typography variant="h6" gutterBottom>
        Gráfico de Barras
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
      <Bar data={data} />
    </Paper>
  );
}

export default ExpenseChart;
