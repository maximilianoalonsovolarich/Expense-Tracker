import React from 'react';
import { Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import './ExpenseSummaryBar.css';

const ExpenseSummaryBar = ({
  totalGastos,
  totalGanancia,
  totalGasto,
  saldoActual,
}) => {
  return (
    <Box className="expense-summary-bar">
      <Typography variant="body1" className="summary-item">
        Total Tickets: {totalGastos}
      </Typography>
      <Typography variant="body1" className="summary-item">
        Total Ganancia:{' '}
        <CountUp end={totalGanancia} prefix="$" duration={1.5} />
      </Typography>
      <Typography variant="body1" className="summary-item">
        Total Gasto: <CountUp end={totalGasto} prefix="$" duration={1.5} />
      </Typography>
      <Typography
        variant="body1"
        className="summary-item"
        style={{ color: saldoActual < 0 ? 'red' : 'inherit' }}
      >
        Saldo Actual: <CountUp end={saldoActual} prefix="$" duration={1.5} />
      </Typography>
    </Box>
  );
};

export default ExpenseSummaryBar;
