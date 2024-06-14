import React from 'react';
import ExpenseCharts from '../components/ExpenseCharts';
import { Container, CssBaseline, Typography, Box } from '@mui/material';

function Statistics({ expenses }) {
  return (
    <Container maxWidth="lg" className="container">
      <CssBaseline />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Estadísticas de Gastos
        </Typography>
        <ExpenseCharts expenses={expenses} />
      </Box>
    </Container>
  );
}

export default Statistics;
