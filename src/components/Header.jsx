import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ mode, toggleColorMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" className="header-title">
          Expense Tracker
        </Typography>
        {location.pathname === '/statistics' ? (
          <Button
            color="inherit"
            className="menu-button"
            onClick={() => handleNavigate('/')}
          >
            Volver al Inicio
          </Button>
        ) : (
          <Button
            color="inherit"
            className="menu-button"
            onClick={() => handleNavigate('/statistics')}
          >
            Ver Estadísticas
          </Button>
        )}
        <div className="header-buttons">
          <IconButton
            sx={{
              ml: 1,
              color: '#FFFFFF',
              '&:hover': {
                color: mode === 'light' ? '#FFEB3B' : '#FFC107',
              },
            }}
            onClick={toggleColorMode}
          >
            {mode === 'light' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
