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
    <Grid
      container
      spacing={2}
      alignItems="center"
      sx={{ mb: 2, justifyContent: 'center' }}
    >
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          label="Desde"
          type="date"
          value={filterStartDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
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
      <Grid item xs={12} sm={12} md={3} textAlign="right">
        <Button variant="contained" color="primary" onClick={handleExport}>
          Exportar a CSV
        </Button>
      </Grid>
    </Grid>
  );
}

export default ExpenseFilters;
