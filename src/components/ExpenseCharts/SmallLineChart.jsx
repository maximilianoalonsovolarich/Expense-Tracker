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
import {
  format,
  parseISO,
  isValid,
  eachDayOfInterval,
  startOfMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getQuincenalLabels = (startDate, endDate) => {
  const start = startOfMonth(startDate);
  const labels = eachDayOfInterval({ start, end: endDate }).filter(
    (date) => date.getDate() === 1 || date.getDate() === 15
  );
  return labels.map((date) => format(date, "d 'de' MMMM yyyy", { locale: es }));
};

const groupExpensesByQuincena = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const date = parseISO(expense.Fecha);
    if (!isValid(date)) {
      console.error(`Fecha inválida: ${expense.Fecha}`);
      return acc;
    }

    const day = date.getDate() <= 15 ? '01' : '15';
    const quincena = format(date, `yyyy-MM-${day}`);

    if (!acc[quincena]) {
      acc[quincena] = 0;
    }
    if (expense.Ganancia) {
      acc[quincena] += expense.Cantidad;
    }
    if (expense.Gasto) {
      acc[quincena] -= expense.Cantidad;
    }
    return acc;
  }, {});
};

const SmallLineChart = ({ expenses }) => {
  const groupedExpenses = groupExpensesByQuincena(expenses);
  const labels = getQuincenalLabels(
    new Date(expenses[0]?.Fecha),
    new Date(expenses[expenses.length - 1]?.Fecha)
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Saldo',
        data: labels.map((label) => groupedExpenses[label] || 0),
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
