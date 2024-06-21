// src/pages/Tabla.jsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography, // Agregar importación de Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchExpenses, fetchCategories } from '../services/api';
import { saveAs } from 'file-saver';
import ExpenseFilters from '../components/ExpenseFilters/ExpenseFilters';
import ExpenseSummaryBar from '../components/ExpenseSummaryBar/ExpenseSummaryBar';

function Tabla() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    async function getExpenses() {
      try {
        const { expenses: expensesData } = await fetchExpenses();
        const categoriesData = await fetchCategories();
        setExpenses(expensesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    }
    getExpenses();
  }, []);

  useEffect(() => {
    setFilteredExpenses(
      expenses
        .filter((expense) =>
          filterStartDate
            ? new Date(expense.Fecha) >= new Date(filterStartDate)
            : true
        )
        .filter((expense) =>
          filterEndDate
            ? new Date(expense.Fecha) <= new Date(filterEndDate)
            : true
        )
        .filter((expense) =>
          filterCategory ? expense.Categoría === filterCategory : true
        )
    );
  }, [expenses, filterStartDate, filterEndDate, filterCategory]);

  const handleExport = () => {
    const csvData = filteredExpenses.map((expense) => ({
      Fecha: expense.Fecha,
      Cantidad: expense.Cantidad,
      Categoría: expense.Categoría,
      Descripción: expense.Descripción,
      Ganancia: expense.Ganancia ? 'Sí' : 'No',
      Gasto: expense.Gasto ? 'Sí' : 'No',
    }));
    const csvContent = [
      ['Fecha', 'Cantidad', 'Categoría', 'Descripción', 'Ganancia', 'Gasto'],
      ...csvData.map((item) => [
        item.Fecha,
        item.Cantidad,
        item.Categoría,
        item.Descripción,
        item.Ganancia,
        item.Gasto,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'gastos.csv');
  };

  const columns = [
    { field: 'Fecha', headerName: 'Fecha', width: 150 },
    { field: 'Cantidad', headerName: 'Cantidad', width: 150 },
    { field: 'Categoría', headerName: 'Categoría', width: 150 },
    { field: 'Descripción', headerName: 'Descripción', width: 200 },
    { field: 'Ganancia', headerName: 'Ganancia', width: 150 },
    { field: 'Gasto', headerName: 'Gasto', width: 150 },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const totalGanancia = filteredExpenses
    .filter((expense) => expense.Ganancia)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const totalGasto = filteredExpenses
    .filter((expense) => expense.Gasto)
    .reduce((total, expense) => total + expense.Cantidad, 0);

  const saldoInicial = expenses.reduce(
    (sum, expense) =>
      expense.Categoría === 'Saldo Inicial' ? sum + expense.Cantidad : sum,
    0
  );

  const saldoActual = saldoInicial + totalGanancia - totalGasto;

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <ExpenseSummaryBar
        totalGastos={filteredExpenses.length}
        totalGanancia={totalGanancia}
        totalGasto={totalGasto}
        saldoActual={saldoActual}
      />
      <ExpenseFilters
        filterStartDate={filterStartDate}
        filterEndDate={filterEndDate}
        filterCategory={filterCategory}
        categories={categories}
        handleStartDateChange={(e) => setFilterStartDate(e.target.value)}
        handleEndDateChange={(e) => setFilterEndDate(e.target.value)}
        handleCategoryChange={(e) => setFilterCategory(e.target.value)}
        handleExport={handleExport}
      />
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          rowsPerPageOptions={[6]}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
          }
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Container>
  );
}

export default Tabla;
