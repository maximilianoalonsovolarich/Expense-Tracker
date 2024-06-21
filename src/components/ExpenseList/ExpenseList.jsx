import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Typography,
  IconButton,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Tooltip,
  Zoom,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ExpenseCard = styled(motion(Paper))`
  padding: 1.5rem;
  background-color: var(--ticket-background);
  border-radius: 15px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ExpenseTitle = styled(Typography)`
  color: var(--primary-main);
  font-weight: 600;
`;

const IconButtonStyled = styled(IconButton)`
  color: var(--primary-main);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const NoExpensesContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
  margin-top: -3rem;
`;

const ITEMS_PER_PAGE = 8;

function ExpenseList({ expenses = [], onDeleteExpense }) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(expenses.length / ITEMS_PER_PAGE) - 1)
    );
  };

  const currentExpenses = expenses.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  if (!expenses || expenses.length === 0) {
    return (
      <NoExpensesContainer>
        <Typography variant="h6">No hay gastos disponibles</Typography>
      </NoExpensesContainer>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {currentExpenses.map((expense, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ExpenseCard
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExpenseTitle variant="h6" gutterBottom>
                Ticket #{expense?.ID || 'No disponible'}
              </ExpenseTitle>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                {expense?.Descripción || 'No disponible'}
              </Typography>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Fecha:{' '}
                  {expense?.Fecha
                    ? format(new Date(expense.Fecha), 'dd MMMM yyyy', {
                        locale: es,
                      })
                    : 'No disponible'}
                </Typography>
                <Typography variant="body1" color="textPrimary" sx={{ my: 1 }}>
                  Cantidad:{' '}
                  {expense?.Cantidad
                    ? new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(expense.Cantidad)
                    : 'No disponible'}
                </Typography>
                <Chip
                  label={expense?.Categoría || 'No especificada'}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Chip
                  label={expense?.Ganancia ? 'Ganancia' : 'Gasto'}
                  color={expense?.Ganancia ? 'success' : 'error'}
                  size="small"
                />
                <Tooltip title="Eliminar gasto" TransitionComponent={Zoom}>
                  <IconButtonStyled
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <DeleteIcon />
                  </IconButtonStyled>
                </Tooltip>
              </Box>
            </ExpenseCard>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          startIcon={<ArrowBackIosIcon />}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={
            currentPage >= Math.ceil(expenses.length / ITEMS_PER_PAGE) - 1
          }
          endIcon={<ArrowForwardIosIcon />}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}

export default ExpenseList;
