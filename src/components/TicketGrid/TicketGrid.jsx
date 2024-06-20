import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DeleteIcon from '@mui/icons-material/Delete';
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

  // Reordenar los gastos para que el último cargado aparezca primero
  const sortedExpenses = filteredExpenses.sort((a, b) => {
    if (a.id === lastLoadedId) return -1;
    if (b.id === lastLoadedId) return 1;
    return 0;
  });

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex);

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
                  md={4}
                  lg={3}
                  ref={nodeRefs.current[index]}
                  className={`grid-item ${
                    expense.id === lastLoadedId ? 'latest-item' : ''
                  }`}
                >
                  <Paper elevation={3} className="ticket-card">
                    <Typography variant="subtitle1">{expense.Fecha}</Typography>
                    <Typography variant="body2">{expense.Categoría}</Typography>
                    <Typography variant="body2">${expense.Cantidad}</Typography>
                    <Typography variant="body2">
                      {expense.Descripción}
                    </Typography>
                    <Typography variant="body2">
                      Ganancia: {expense.Ganancia ? 'Sí' : 'No'}
                    </Typography>
                    <Typography variant="body2">
                      Gasto: {expense.Gasto ? 'Sí' : 'No'}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </Grid>
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
