// ExpenseList.jsx

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
import { format, isToday, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

// Styled-components for NoExpensesContainer and others
const NoExpensesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ExpenseCard = styled(motion.div)`
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExpenseTitle = styled(Typography)`
  font-weight: bold;
`;

const IconButtonStyled = styled(IconButton)`
  padding: 6px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const RECENT_THRESHOLD_HOURS = 24;

const isValidDate = (dateString) => {
  if (dateString === 'No disponible') return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const getValidDate = (dateString) => {
  if (dateString === 'No disponible') {
    return null;
  }
  if (isValidDate(dateString)) {
    return new Date(dateString);
  }
  console.warn(`Invalid date encountered: ${dateString}`);
  return null;
};

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
    const validDate = getValidDate(date);
    if (!validDate) return false;
    return differenceInHours(new Date(), validDate) <= RECENT_THRESHOLD_HOURS;
  };

  const sortedExpenses = expenses.sort((a, b) => {
    const dateA = getValidDate(a.Fecha);
    const dateB = getValidDate(b.Fecha);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    if (dateB - dateA !== 0) return dateB - dateA;

    return b.ID - a.ID;
  });

  const todayAndRecentExpenses = sortedExpenses.filter((expense) => {
    const validDate = getValidDate(expense.Fecha);
    return validDate && (isToday(validDate) || isRecent(expense.Fecha));
  });
  const otherExpenses = sortedExpenses.filter((expense) => {
    const validDate = getValidDate(expense.Fecha);
    return !validDate || (!isToday(validDate) && !isRecent(expense.Fecha));
  });

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
        {currentExpenses.map((expense, index) => {
          const validDate = getValidDate(expense.Fecha);
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ExpenseCard
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                isToday={validDate && isToday(validDate)}
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
                    {validDate
                      ? format(validDate, 'dd MMMM yyyy', { locale: es })
                      : 'No disponible'}
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
          );
        })}
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
