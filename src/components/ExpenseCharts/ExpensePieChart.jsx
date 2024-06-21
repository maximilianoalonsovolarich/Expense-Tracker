import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import './ExpensePieChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  const [filter, setFilter] = useState('Cantidad');

  const data = {
    labels: expenses.map((expense) => {
      const date = parseISO(expense.fields.Fecha);
      return isValid(date)
        ? format(date, 'd MMMM yyyy', { locale: es })
        : 'Fecha inválida';
    }),
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
