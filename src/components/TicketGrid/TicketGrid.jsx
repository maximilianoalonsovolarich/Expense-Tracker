//Ticket Grid component that displays the expenses in a grid layout. It includes a pagination system, filters, and export options.
import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FiltersAndExport from '../FiltersAndExport/FiltersAndExport';
import './TicketGrid.css';

const TicketGrid = ({
  expenses,
  categories = [],
  handleExport,
  handleDeleteExpense,
  lastLoadedId,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const itemsPerPage = useMediaQuery('(max-width:600px)') ? 1 : 8;
  const nodeRefs = useRef([]);

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePreviousPage = () =>
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  const handleDateFromChange = (event) => setFilterDateFrom(event.target.value);
  const handleDateToChange = (event) => setFilterDateTo(event.target.value);
  const handleCategoryChange = (event) => setFilterCategory(event.target.value);
  const handleSearchTextChange = (event) => setSearchText(event.target.value);

  const filteredExpenses = expenses
    .filter((expense) =>
      filterDateFrom
        ? new Date(expense.Fecha) >= new Date(filterDateFrom)
        : true
    )
    .filter((expense) =>
      filterDateTo ? new Date(expense.Fecha) <= new Date(filterDateTo) : true
    )
    .filter((expense) =>
      filterCategory ? expense.Categoría === filterCategory : true
    )
    .filter((expense) =>
      searchText
        ? Object.values(expense).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        : true
    );

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (a.id === lastLoadedId) return -1;
    if (b.id === lastLoadedId) return 1;
    return 0;
  });

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex);

  useEffect(() => {
    if (lastLoadedId) {
      const lastLoadedIndex = sortedExpenses.findIndex(
        (expense) => expense.id === lastLoadedId
      );
      if (lastLoadedIndex >= 0) {
        setCurrentPage(Math.floor(lastLoadedIndex / itemsPerPage));
      }
    }
  }, [lastLoadedId, sortedExpenses, itemsPerPage]);

  const renderExpense = (expense, index) => (
    <Paper
      elevation={3}
      className={`ticket-card ${
        expense.id === lastLoadedId ? 'latest-item' : ''
      }`}
      key={index}
    >
      <Box className="ticket-header">
        <Typography variant="h6" className="ticket-title">
          Ticket de {expense.Ganancia ? 'Ingreso' : 'Gasto'}
        </Typography>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteExpense(expense.id)}
          className="delete-button"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box className="ticket-content">
        <Box className="ticket-row">
          <DateRangeIcon className="ticket-icon" />
          <Typography variant="subtitle1">{expense.Fecha}</Typography>
        </Box>
        <Box className="ticket-row">
          <CategoryIcon className="ticket-icon" />
          <Typography variant="body1">{expense.Categoría}</Typography>
        </Box>
        <Box className="ticket-row">
          <AttachMoneyIcon className="ticket-icon" />
          <Typography variant="h5" className="ticket-amount">
            {expense.Cantidad.toFixed(2)}
          </Typography>
        </Box>
        <Box className="ticket-row">
          <DescriptionIcon className="ticket-icon" />
          <Typography variant="body2" noWrap>
            {expense.Descripción}
          </Typography>
        </Box>
        <Box className="ticket-row">
          {expense.Ganancia ? (
            <TrendingUpIcon className="ticket-icon income" />
          ) : (
            <TrendingDownIcon className="ticket-icon expense" />
          )}
          <Typography variant="body2">
            {expense.Ganancia ? 'Ingreso' : 'Gasto'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  if (!expenses.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <FiltersAndExport
        filterDateFrom={filterDateFrom}
        filterDateTo={filterDateTo}
        filterCategory={filterCategory}
        searchText={searchText}
        handleDateFromChange={handleDateFromChange}
        handleDateToChange={handleDateToChange}
        handleCategoryChange={handleCategoryChange}
        handleSearchTextChange={handleSearchTextChange}
        handleExport={handleExport}
        categories={categories}
      />
      <Grid container spacing={2} className="grid-container">
        <TransitionGroup component={null}>
          {currentExpenses.map((expense, index) => {
            if (!nodeRefs.current[index]) {
              nodeRefs.current[index] = React.createRef();
            }

            return (
              <CSSTransition
                key={expense.id}
                timeout={300}
                classNames="ticket"
                nodeRef={nodeRefs.current[index]}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                  ref={nodeRefs.current[index]}
                  className={`grid-item ${
                    expense.id === lastLoadedId ? 'latest-item' : ''
                  }`}
                >
                  {renderExpense(expense, index)}
                </Grid>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </Grid>
      <Box className="pagination-buttons">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <NavigateBeforeIcon className="pagination-button-icon" />
          Anterior
        </button>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={endIndex >= filteredExpenses.length}
        >
          Siguiente
          <NavigateNextIcon className="pagination-button-icon" />
        </button>
      </Box>
    </Box>
  );
};

export default TicketGrid;
