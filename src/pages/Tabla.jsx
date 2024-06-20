import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchExpenses, fetchCategories } from '../services/api';
import { saveAs } from 'file-saver';
import FiltersAndExport from '../components/FiltersAndExport/FiltersAndExport';

function Tabla() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchText, setSearchText] = useState('');
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
        .filter((expense) =>
          searchText
            ? Object.values(expense).some((value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
              )
            : true
        )
    );
  }, [expenses, filterStartDate, filterEndDate, filterCategory, searchText]);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 2, mb: 2, textAlign: 'left' }}
      >
        Tabla de Gastos
      </Typography>
      <FiltersAndExport
        filterDateFrom={filterStartDate}
        filterDateTo={filterEndDate}
        filterCategory={filterCategory}
        searchText={searchText}
        handleDateFromChange={(e) => setFilterStartDate(e.target.value)}
        handleDateToChange={(e) => setFilterEndDate(e.target.value)}
        handleCategoryChange={(e) => setFilterCategory(e.target.value)}
        handleSearchTextChange={(e) => setSearchText(e.target.value)}
        handleExport={handleExport}
        categories={categories}
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
