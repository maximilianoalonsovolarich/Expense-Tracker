import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#4285F4',
    },
    secondary: {
      main: '#DB4437',
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: grey[900],
            paper: grey[800],
          },
        }
      : {
          background: {
            default: '#F1F3F4',
            paper: '#FFFFFF',
          },
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const theme = (mode) => createTheme(getDesignTokens(mode));

export default theme;
