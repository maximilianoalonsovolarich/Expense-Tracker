import React, { useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Divider,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ExpenseList({ expenses = [], onDeleteExpense }) {
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0);

  useEffect(() => {
    if (expenses.length > 0) {
      setCurrentExpenseIndex(expenses.length - 1); // Set the index to the latest expense
    }
  }, [expenses]);

  const handlePrevious = () => {
    setCurrentExpenseIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNext = () => {
    setCurrentExpenseIndex((prevIndex) =>
      prevIndex < expenses.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const currentExpense = expenses[currentExpenseIndex];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        height: '100%',
        backgroundColor: currentExpense?.Ingreso
          ? 'rgba(144, 238, 144, 0.1)'
          : 'rgba(255, 99, 71, 0.1)',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: currentExpense?.Ingreso
            ? 'rgba(144, 238, 144, 0.2)'
            : 'rgba(255, 99, 71, 0.2)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h6" gutterBottom>
          Gastos
        </Typography>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDeleteExpense(currentExpense.id)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <DeleteIcon />
        </IconButton>
        <Typography variant="subtitle1" color="textPrimary">
          Fecha: {currentExpense?.Fecha || 'No disponible'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cantidad: {currentExpense?.Cantidad || 'No disponible'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Categoría: {currentExpense?.Categoría || 'No disponible'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Descripción: {currentExpense?.Descripción || 'No disponible'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ingreso: {currentExpense?.Ingreso ? 'Sí' : 'No'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Egreso: {currentExpense?.Egreso ? 'Sí' : 'No'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <IconButton
              onClick={handlePrevious}
              disabled={currentExpenseIndex === 0}
              sx={{
                width: '100%',
                borderRadius: '15px',
                backgroundColor:
                  currentExpenseIndex === 0 ? '#BDBDBD' : '#1976D2',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor:
                    currentExpenseIndex === 0 ? '#BDBDBD' : '#115293',
                },
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <IconButton
              onClick={handleNext}
              disabled={currentExpenseIndex === expenses.length - 1}
              sx={{
                width: '100%',
                borderRadius: '15px',
                backgroundColor:
                  currentExpenseIndex === expenses.length - 1
                    ? '#BDBDBD'
                    : '#1976D2',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor:
                    currentExpenseIndex === expenses.length - 1
                      ? '#BDBDBD'
                      : '#115293',
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ExpenseList;
