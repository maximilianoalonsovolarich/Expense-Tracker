import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const ExpenseCard = styled(Paper)`
  padding: 1rem;
  background-color: var(--ticket-background); // Usando la variable CSS
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const ExpenseTitle = styled(Typography)`
  color: var(--primary-main);
`;

const IconButtonStyled = styled(IconButton)`
  color: var(--primary-main);
`;

const NoExpensesContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
  margin-top: -3rem;
`;

function ExpenseList({ expenses = [], onDeleteExpense }) {
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0);

  useEffect(() => {
    if (expenses.length > 0) {
      setCurrentExpenseIndex(expenses.length - 1);
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

  if (!expenses || expenses.length === 0) {
    return null;
  }

  const currentExpense = expenses[currentExpenseIndex];

  return (
    <ExpenseCard
      sx={{
        backgroundColor: currentExpense?.Ganancia
          ? 'rgba(0, 128, 0, 0.1)'
          : 'rgba(255, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ticket #{currentExpense?.ID || 'No disponible'}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
        {currentExpense?.Descripción || 'No disponible'}
      </Typography>
      <Box sx={{ position: 'relative' }}>
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
          Ganancia: {currentExpense?.Ganancia ? 'Sí' : 'No'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Gasto: {currentExpense?.Gasto ? 'Sí' : 'No'}
        </Typography>
        <IconButtonStyled
          edge="end"
          aria-label="delete"
          onClick={() => onDeleteExpense(currentExpense.id)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <DeleteIcon />
        </IconButtonStyled>
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
    </ExpenseCard>
  );
}

export default ExpenseList;
