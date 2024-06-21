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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';
import { format, isToday, startOfDay, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

const ExpenseCard = styled(motion(Paper))`
  padding: 1rem;
  background-color: ${({ isToday, isRecent }) =>
    isToday
      ? 'rgba(144, 202, 249, 0.2)' // Azul claro para el día actual
      : isRecent
      ? 'rgba(129, 199, 132, 0.2)' // Verde claro para entradas recientes
      : 'var(--ticket-background)'};
  border-radius: 15px;
  margin-bottom: 1rem;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ isToday, isRecent }) =>
    isToday || isRecent
      ? '0 4px 8px rgba(0, 0, 0, 0.1)'
      : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  border-left: ${({ isToday, isRecent }) =>
    isToday ? '4px solid #2196f3' : isRecent ? '4px solid #4caf50' : 'none'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ExpenseTitle = styled(Typography)`
  color: var(--primary-main);
  font-weight: 500;
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
  text-align: center;
`;

const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const RECENT_THRESHOLD_HOURS = 24;

function ExpenseList({ expenses = [], onDeleteExpense }) {
  const [currentPage, setCurrentPage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ITEMS_PER_PAGE = isMobile ? 2 : 8;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(expenses.length / ITEMS_PER_PAGE) - 1)
    );
  };

  const isRecent = (date) => {
    return (
      differenceInHours(new Date(), new Date(date)) <= RECENT_THRESHOLD_HOURS
    );
  };

  const sortedExpenses = expenses.sort((a, b) => {
    const dateA = new Date(a.Fecha);
    const dateB = new Date(b.Fecha);

    // Primero, ordenar por fecha (más reciente primero)
    if (dateB - dateA !== 0) return dateB - dateA;

    // Si las fechas son iguales, ordenar por ID (asumiendo que ID más alto es más reciente)
    return b.ID - a.ID;
  });

  // Asegurarse de que los gastos de hoy y los recientes siempre estén en la primera página
  const todayAndRecentExpenses = sortedExpenses.filter(
    (expense) => isToday(new Date(expense.Fecha)) || isRecent(expense.Fecha)
  );
  const otherExpenses = sortedExpenses.filter(
    (expense) => !isToday(new Date(expense.Fecha)) && !isRecent(expense.Fecha)
  );

  const currentExpenses = [...todayAndRecentExpenses, ...otherExpenses].slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  if (!expenses.length) {
    return (
      <NoExpensesContainer>
        <Typography variant="h6">No hay gastos disponibles</Typography>
      </NoExpensesContainer>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {currentExpenses.map((expense, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ExpenseCard
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              isToday={isToday(new Date(expense.Fecha))}
              isRecent={isRecent(expense.Fecha)}
            >
              <Box>
                <ExpenseTitle variant="h6">
                  Ticket #{expense.ID || 'No disponible'}
                </ExpenseTitle>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ textDecoration: 'underline' }}
                >
                  {expense.Descripción || 'No disponible'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Fecha:{' '}
                  {format(new Date(expense.Fecha), 'dd MMMM yyyy', {
                    locale: es,
                  })}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  Monto:{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(expense.Cantidad)}
                </Typography>
                <Chip
                  label={expense.Categoría || 'No especificada'}
                  color="primary"
                  size="small"
                  sx={{ marginTop: '0.5rem' }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {expense.Ganancia ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Chip
                  label={expense.Ganancia ? 'Ganancia' : 'Gasto'}
                  color={expense.Ganancia ? 'success' : 'error'}
                  size="small"
                />
                <Tooltip title="Eliminar gasto" TransitionComponent={Zoom}>
                  <IconButtonStyled
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
      <PaginationContainer>
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
            currentPage >= Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE) - 1
          }
          endIcon={<ArrowForwardIosIcon />}
        >
          Siguiente
        </Button>
      </PaginationContainer>
    </Box>
  );
}

export default ExpenseList;
