import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchExpenses, fetchCategories } from '../services/api';
import { saveAs } from 'file-saver';

function Tabla() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
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
          filterDate ? new Date(expense.Fecha) <= new Date(filterDate) : true
        )
        .filter((expense) =>
          filterCategory ? expense.Categoría === filterCategory : true
        )
    );
  }, [expenses, filterDate, filterCategory]);

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
        sx={{ mt: 2, mb: 2, textAlign: 'center' }}
      >
        Tabla de Gastos
      </Typography>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ mb: 2, justifyContent: 'center' }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Filtrar por Fecha"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Filtrar por Categoría"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            select
            fullWidth
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={6} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleExport}>
            Exportar a CSV
          </Button>
        </Grid>
      </Grid>
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
