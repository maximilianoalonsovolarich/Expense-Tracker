// src/components/ExpenseList.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Divider,
  Box,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ExpenseList({ expenses, onDeleteExpense }) {
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0);

  useEffect(() => {
    if (expenses.length > 0) {
      setCurrentExpenseIndex(0);
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
    <Paper elevation={3} sx={{ padding: 2, borderRadius: '15px' }}>
      <Typography variant="h5" gutterBottom>
        Gastos
      </Typography>
      {currentExpense ? (
        <Box sx={{ position: 'relative' }}>
          <Typography variant="subtitle1" color="textPrimary">
            Fecha: {currentExpense.Fecha || 'No disponible'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Cantidad: {currentExpense.Cantidad || 'No disponible'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Categoría: {currentExpense.Categoría || 'No disponible'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Descripción: {currentExpense.Descripción || 'No disponible'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ingreso: {currentExpense.Ingreso || 'No disponible'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Egreso: {currentExpense.Egreso || 'No disponible'}
          </Typography>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onDeleteExpense(currentExpense.id)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <DeleteIcon />
          </IconButton>
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
                <ArrowBackIosIcon />
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
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Typography>No hay gastos disponibles</Typography>
      )}
    </Paper>
  );
}

export default ExpenseList;
