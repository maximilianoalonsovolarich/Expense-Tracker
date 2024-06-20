/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
  BarChart as BarChartIcon,
  TableChart as TableChartIcon,
  ExitToApp as ExitToAppIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logOut } from '../../services/firebase';
import 'react-toastify/dist/ReactToastify.css';
import useCache from '../../hooks/useCache';
import { fetchExpenses } from '../../services/api';

const HeaderTitle = styled(Typography)`
  flex-grow: 1;
  font-size: 1.5rem;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MenuButton = styled(IconButton)`
  margin-right: 1rem;
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

function Header({ mode, toggleColorMode }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { clearCache } = useCache('expenses', fetchExpenses);

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

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setDrawerOpen(false);
    },
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      toast.success('Cierre de sesión exitoso');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión: ' + error.message);
    }
  }, [navigate]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleClearCache = useCallback(() => {
    clearCache();
    window.location.reload();
  }, [clearCache]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {user && (
            <MenuButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </MenuButton>
          )}
          <HeaderTitle variant="h6">Finanzas</HeaderTitle>
          <IconButton
            sx={{
              color: '#FFFFFF',
              transition: 'color 0.5s',
              '&:hover': { color: mode === 'light' ? '#FFEB3B' : '#FFC107' },
            }}
            onClick={toggleColorMode}
          >
            {mode === 'light' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {user && (
            <Button
              color="inherit"
              onClick={handleClearCache}
              startIcon={<RefreshIcon />}
            ></Button>
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItem button onClick={() => handleNavigate('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('/statistics')}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Estadísticas" />
            </ListItem>
            <ListItem button onClick={() => handleNavigate('/tabla')}>
              <ListItemIcon>
                <TableChartIcon />
              </ListItemIcon>
              <ListItemText primary="Tabla" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </>
  );
}

export default Header;
