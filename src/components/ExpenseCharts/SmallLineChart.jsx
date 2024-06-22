// SmallLineChart-CwtACpS9.js

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
  endOfMonth,
} from 'date-fns';

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
  const end = endOfMonth(endDate);
  const labels = eachDayOfInterval({ start, end }).filter(
    (date) => date.getDate() === 1 || date.getDate() === 15
  );
  return labels.map((date) => format(date, 'yyyy-MM-dd'));
};

const groupExpensesByQuincena = (expenses) => {
  return expenses.reduce((acc, expense) => {
    if (expense.Fecha === 'No disponible') {
      console.warn(`Fecha no disponible para el gasto: ${expense.ID}`);
      return acc;
    }
    const date = parseISO(expense.Fecha);
    if (!isValid(date)) {
      console.error(`Fecha inválida: ${expense.Fecha}`);
      return acc;
    }
    const day = date.getDate() <= 15 ? '01' : '15';
    const quincena = `${format(date, 'yyyy-MM')}-${day}`;
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
  const validExpenses = expenses.filter(
    (expense) =>
      expense.Fecha !== 'No disponible' && isValid(parseISO(expense.Fecha))
  );

  if (validExpenses.length === 0) {
    return <div>No hay datos válidos para mostrar en el gráfico.</div>;
  }

  const groupedExpenses = groupExpensesByQuincena(validExpenses);
  const startDate = parseISO(validExpenses[0]?.Fecha);
  const endDate = parseISO(validExpenses[validExpenses.length - 1]?.Fecha);
  const labels = getQuincenalLabels(startDate, endDate);

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
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
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
        title: {
          display: true,
          text: 'Fecha',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Arial',
            size: 10,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.1)',
        },
        title: {
          display: true,
          text: 'Saldo',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Arial',
            size: 10,
          },
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
