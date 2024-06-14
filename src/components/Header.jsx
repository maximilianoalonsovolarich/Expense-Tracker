import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logOut } from '../firebase';
import { toast } from 'react-toastify';

function Header({ mode, toggleColorMode }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Cierre de sesión exitoso');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión: ' + error.message);
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" className="header-title" sx={{ flexGrow: 1 }}>
          Aplicación de Gastos
        </Typography>
        {user && (
          <>
            {location.pathname === '/statistics' ? (
              <Button color="inherit" onClick={() => handleNavigate('/')}>
                Volver al Inicio
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => handleNavigate('/statistics')}
              >
                Ver Estadísticas
              </Button>
            )}
            <Box sx={{ ml: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  backgroundColor: '#1976D2',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </>
        )}
        <IconButton
          sx={{
            ml: 1,
            color: '#FFFFFF',
            transition: 'color 0.5s',
            '&:hover': {
              color: mode === 'light' ? '#FFEB3B' : '#FFC107',
            },
          }}
          onClick={toggleColorMode}
        >
          {mode === 'light' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
