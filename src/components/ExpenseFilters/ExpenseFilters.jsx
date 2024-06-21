// src/components/ExpenseFilters/ExpenseFilters.jsx

import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Box,
} from '@mui/material';

function ExpenseFilters({
  filterStartDate,
  filterEndDate,
  filterCategory,
  categories,
  handleStartDateChange,
  handleEndDateChange,
  handleCategoryChange,
  handleExport,
}) {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Grid
        container
        spacing={3}
        alignItems="center"
        sx={{
          justifyContent: 'center',
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
          },
        }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Desde"
            type="date"
            value={filterStartDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                transition: 'all 0.3s ease',
                backgroundColor: '#fff',
                borderRadius: 1,
                '&:hover': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Hasta"
            type="date"
            value={filterEndDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                transition: 'all 0.3s ease',
                backgroundColor: '#fff',
                borderRadius: 1,
                '&:hover': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel htmlFor="filter-category">Categoría</InputLabel>
            <Select
              value={filterCategory}
              onChange={handleCategoryChange}
              label="Categoría"
              inputProps={{ name: 'filter-category', id: 'filter-category' }}
              sx={{
                transition: 'all 0.3s ease',
                backgroundColor: '#fff',
                borderRadius: 1,
                '&:hover': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                },
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{
              transition: 'all 0.3s ease',
              borderRadius: 1,
              '&:hover': {
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                transform: 'scale(1.05)',
              },
            }}
          >
            Exportar a CSV
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExpenseFilters;
