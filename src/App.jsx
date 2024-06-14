import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getTheme from './theme';
import Statistics from './pages/Statistics';
import { fetchExpenses } from './services/api';

function App() {
  const storedMode = localStorage.getItem('theme') || 'light';
  const [mode, setMode] = useState(storedMode);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expensesData = await fetchExpenses();
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
    getExpenses();
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header mode={mode} toggleColorMode={toggleColorMode} />
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard expenses={expenses} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics expenses={expenses} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
