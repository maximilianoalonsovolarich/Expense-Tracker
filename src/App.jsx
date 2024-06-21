import React, {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress,
} from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Header from './components/Header/Header';
import ErrorFallback from './components/ErrorFallback/ErrorFallback';
import ErrorPage from './pages/ErrorPage';
import getTheme from './theme';
import useAuth from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StoicQuoteModal from './components/StoicQuoteModal/StoicQuoteModal';
import { ModalProvider } from './hooks/useModal.jsx';
import { fetchCategories } from './services/api';

import './index.css';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Tabla = React.lazy(() => import('./pages/Tabla'));

function App() {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const { user, loading } = useAuth();

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  const nodeRef = useRef(null);

  // Cargar categorías de Airtable al iniciar el componente
  useEffect(() => {
    async function loadCategories() {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    }

    loadCategories();
  }, []);

  if (loading) {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ModalProvider>
          <Header mode={mode} toggleColorMode={toggleColorMode} user={user} />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<CircularProgress />}>
              <Routes>
                {[
                  {
                    path: '/login',
                    element: user ? <Navigate to="/" /> : <Login />,
                  },
                  {
                    path: '/register',
                    element: user ? <Navigate to="/" /> : <Register />,
                  },
                  {
                    path: '/',
                    element: (
                      <ProtectedRoute>
                        <Dashboard categories={categories} />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: '/statistics',
                    element: (
                      <ProtectedRoute>
                        <Statistics categories={categories} />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: '/tabla',
                    element: (
                      <ProtectedRoute>
                        <Tabla categories={categories} />
                      </ProtectedRoute>
                    ),
                  },
                  { path: '*', element: <ErrorPage /> },
                ].map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <CSSTransition
                        timeout={300}
                        classNames="fade"
                        nodeRef={nodeRef}
                      >
                        <div ref={nodeRef}>{element}</div>
                      </CSSTransition>
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <ToastContainer position="top-right" autoClose={3000} />
          <StoicQuoteModal />
        </ModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
//se ajusta 
