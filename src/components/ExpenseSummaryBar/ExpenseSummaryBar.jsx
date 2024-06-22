import React from 'react';
import { Grid, Paper, Typography, Box, useMediaQuery } from '@mui/material';
import CountUp from 'react-countup';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Carousel from 'react-material-ui-carousel';
import './ExpenseSummaryBar.css';

const ExpenseSummaryBar = ({
  totalGastos,
  totalGanancia,
  totalGasto,
  saldoActual,
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const summaryItems = [
    {
      title: 'Tickets',
      value: totalGastos,
      icon: ReceiptIcon,
      prefix: '',
    },
    {
      title: 'Ingreso',
      value: totalGanancia,
      icon: TrendingUpIcon,
      prefix: '$',
    },
    {
      title: 'Egreso',
      value: totalGasto,
      icon: TrendingDownIcon,
      prefix: '$',
    },
    {
      title: 'Saldo',
      value: saldoActual,
      icon: AccountBalanceWalletIcon,
      prefix: '$',
    },
  ];

  const renderSummaryItem = (item, index) => (
    <Paper elevation={2} className="summary-card" key={index}>
      <Box className="summary-icon">
        <item.icon fontSize="small" />
      </Box>
      <Box className="summary-content">
        <Typography variant="body2" className="summary-title">
          {item.title}
        </Typography>
        <Typography variant="body1" className="summary-value">
          <CountUp
            end={item.value}
            prefix={item.prefix}
            duration={1.5}
            separator=","
            decimals={item.prefix === '$' ? 2 : 0}
          />
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <div className="expense-summary-bar">
      {isMobile ? (
        <Carousel
          interval={3000}
          indicators={false}
          navButtonsAlwaysVisible={false}
        >
          {summaryItems.map((item, index) => renderSummaryItem(item, index))}
        </Carousel>
      ) : (
        <Grid container spacing={2}>
          {summaryItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {renderSummaryItem(item, index)}
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ExpenseSummaryBar;
