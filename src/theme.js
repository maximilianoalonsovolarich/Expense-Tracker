// src/theme.js

import { createTheme } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors';

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
            default: '#121212',
            paper: '#424242',
          },
          text: {
            primary: '#ffffff',
            secondary: grey[500],
          },
          action: {
            active: '#ffffff',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }
      : {
          background: {
            default: '#F1F3F4',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#000000',
            secondary: grey[800],
          },
          action: {
            active: '#000000',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          color: mode === 'dark' ? '#ffffff' : '#000000',
        },
        columnHeaders: {
          backgroundColor: mode === 'dark' ? blue[700] : blue[100],
        },
        row: {
          '&:nth-of-type(even)': {
            backgroundColor: mode === 'dark' ? grey[800] : grey[100],
          },
          '&:nth-of-type(odd)': {
            backgroundColor: mode === 'dark' ? grey[900] : '#ffffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: mode === 'dark' ? '#ffffff' : '#000000',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'dark' ? '#ffffff' : '#000000',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? '#ffffff' : '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'dark' ? '#ffffff' : '#000000',
            },
          },
          '& .MuiInputBase-input': {
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#424242' : '#ffffff',
        },
      },
    },
  },
});

const theme = (mode) => createTheme(getDesignTokens(mode));

export default theme;
