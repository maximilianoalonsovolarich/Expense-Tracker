import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, parseISO, isValid } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SmallLineChart = ({ expenses }) => {
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = parseISO(expense.Fecha);
    if (!isValid(date)) {
      // Verifica si la fecha es válida
      console.error(`Fecha inválida: ${expense.Fecha}`);
      return acc;
    }
    const month = format(date, 'yyyy-MM');
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.Cantidad;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(groupedExpenses),
    datasets: [
      {
        label: 'Cantidad',
        data: Object.values(groupedExpenses),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.1)',
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SmallLineChart;
