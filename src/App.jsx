// App.jsx
import React, { Suspense } from 'react';
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

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Tabla = React.lazy(() => import('./pages/Tabla'));

function App() {
  const [mode, setMode] = React.useState(
    localStorage.getItem('theme') || 'light'
  );
  const { user, loading } = useAuth();

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = React.useMemo(() => getTheme(mode), [mode]);

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
          {' '}
          {/* envolvemos la aplicación con el proveedor de modal */}
          <Header mode={mode} toggleColorMode={toggleColorMode} />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<CircularProgress />}>
              <Routes>
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route
                  path="/register"
                  element={user ? <Navigate to="/" /> : <Register />}
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/statistics"
                  element={
                    <ProtectedRoute>
                      <Statistics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tabla"
                  element={
                    <ProtectedRoute>
                      <Tabla />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <ToastContainer />
          <StoicQuoteModal />
        </ModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
