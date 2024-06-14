import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ExpenseList({ expenses, onDeleteExpense }) {
  const [currentExpenseIndex, setCurrentExpenseIndex] = useState(
    expenses.length - 1
  );

  useEffect(() => {
    setCurrentExpenseIndex(expenses.length - 1);
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
    <Box>
      <Typography variant="h5" gutterBottom>
        Gastos
      </Typography>
      {currentExpense && (
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginBottom: 2,
            backgroundColor: 'background.paper',
            borderRadius: '15px',
            position: 'relative',
          }}
        >
          <CardContent>
            <Typography variant="h6" color="primary">
              Fecha: {currentExpense.fields.Fecha}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Cantidad: {currentExpense.fields.Cantidad}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Categoría: {currentExpense.fields.Categoría}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Descripción: {currentExpense.fields.Descripción}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Ingreso: {currentExpense.fields.Ingreso}
            </Typography>
            <Typography variant="body1" color="text.primary">
              Egreso: {currentExpense.fields.Egreso}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDeleteExpense(currentExpense.id)}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Paper>
      )}
      {expenses.length > 0 && (
        <Box display="flex" justifyContent="space-between" mt={2}>
          <IconButton
            onClick={handlePrevious}
            disabled={currentExpenseIndex === 0}
            sx={{
              backgroundColor:
                currentExpenseIndex === 0 ? '#BDBDBD' : '#1976D2',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#1976D2' },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentExpenseIndex === expenses.length - 1}
            sx={{
              backgroundColor:
                currentExpenseIndex === expenses.length - 1
                  ? '#BDBDBD'
                  : '#1976D2',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#1976D2' },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default ExpenseList;
