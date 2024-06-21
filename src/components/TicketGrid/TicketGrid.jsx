import React, { useState, useRef } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Carousel from 'react-material-ui-carousel';
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
  const itemsPerPage = 8;
  const nodeRefs = useRef([]);
  const isMobile = useMediaQuery('(max-width:600px)');

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

  const renderExpense = (expense, index) => (
    <Paper elevation={3} className="ticket-card" key={index}>
      <Box className="ticket-header">
        <Typography variant="h6" className="ticket-title">
          Ticket de {expense.Ganancia ? 'Ingreso' : 'Gasto'}
        </Typography>
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
            ${expense.Cantidad.toFixed(2)}
          </Typography>
        </Box>
        <Box className="ticket-row">
          <DescriptionIcon className="ticket-icon" />
          <Typography variant="body2">{expense.Descripción}</Typography>
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
      <Box className="ticket-footer">
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteExpense(expense.id)}
          className="delete-button"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );

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
      {isMobile ? (
        <Carousel
          interval={3000}
          indicators={false}
          navButtonsAlwaysVisible={false}
        >
          {currentExpenses.map((expense, index) =>
            renderExpense(expense, index)
          )}
        </Carousel>
      ) : (
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
                    md={4}
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
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={endIndex >= filteredExpenses.length}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default TicketGrid;
