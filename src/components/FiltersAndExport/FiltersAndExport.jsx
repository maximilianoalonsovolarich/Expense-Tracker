// src/components/FiltersAndExport/FiltersAndExport.jsx

import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const FiltersAndExport = ({
  filterDateFrom,
  filterDateTo,
  filterCategory,
  searchText,
  handleDateFromChange,
  handleDateToChange,
  handleCategoryChange,
  handleSearchTextChange,
  handleExport,
  categories = [],
}) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ width: '100%', justifyContent: 'center' }}
      >
        <TextField
          label="Buscar"
          value={searchText}
          onChange={handleSearchTextChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          fullWidth
          size="small"
        />
        <TextField
          label="Desde"
          type="date"
          value={filterDateFrom}
          onChange={handleDateFromChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <DateRangeIcon sx={{ mr: 1 }} />,
          }}
          fullWidth
          size="small"
        />
        <TextField
          label="Hasta"
          type="date"
          value={filterDateTo}
          onChange={handleDateToChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <DateRangeIcon sx={{ mr: 1 }} />,
          }}
          fullWidth
          size="small"
        />
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel htmlFor="filter-category">Categoría</InputLabel>
          <Select
            value={filterCategory}
            onChange={handleCategoryChange}
            label="Categoría"
            inputProps={{ name: 'filter-category', id: 'filter-category' }}
            startAdornment={<CategoryIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          startIcon={<SaveAltIcon />}
        ></Button>
      </Stack>
    </Box>
  );
};

export default FiltersAndExport;
