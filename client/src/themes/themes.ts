import { createTheme, alpha } from '@mui/material/styles';

export const journalColors = {
  accent: {
    light: '#4fbd0e', // moss green — warm undertone, not cool/minty
    dark: '#18b53a',
  },
  destructive: {
    light: '#B3402C',
    dark: '#C9583F',
  },
  pin: {
    active: { light: '#B5651D', dark: '#D98C4A' },   // unchanged — warm amber reads like leather/wood against green
    inactive: { light: '#C7BCA8', dark: '#4A4335' },  // unchanged
  },
};

export const getTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#1C1A17' : '#FAF7F2',
        paper: isDarkMode ? '#202020' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#EDE8E0' : '#2E2A25',
        // secondary: isDarkMode ? '#c6c6c6' : '#acacac',
      },
      // divider: isDarkMode ? '#3A342C' : '#E3DBCC',
      primary: {
        main: isDarkMode ? journalColors.accent.dark : journalColors.accent.light,
        contrastText: isDarkMode ? '#1C1A17' : '#FFFFFF',
      },
      error: {
        main: isDarkMode ? journalColors.destructive.dark : journalColors.destructive.light,
      },
      action: {
        selected: isDarkMode ? journalColors.accent.dark : journalColors.accent.light,
        hover: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(46, 42, 37, 0.05)',
      },
    },

    components: {
      MuiInputBase: {
        styleOverrides: {
          input: ({ theme }) => ({
            '&:-webkit-autofill': {
              // Dynamically pulls background color from the active theme
              WebkitBoxShadow: `0 0 0 100px ${theme.palette.mode === 'dark' ? '#20202000' : '#ffffff'
                } inset !important`,
              // Dynamically adjusts text color
              WebkitTextFillColor: `${theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                } !important`,
              caretColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            },
          }),
        },
      },

      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        variants: [
          {
            props: { variant: 'square' },
            style: ({ theme }) => ({
              textTransform: 'none',
              borderRadius: 6,
              fontWeight: 500,
              color: theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.055)'
                  : 'rgba(55, 53, 47, 0.06)',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(55, 53, 47, 0.12)',
              },
            }),
          }]
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
        variants: [
          {
            props: { variant: 'noteMenu' },
            style: ({ theme }) => ({
              borderRadius: 6,
              color: theme.palette.text.primary,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.055)'
                  : 'rgba(55, 53, 47, 0.06)',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(55, 53, 47, 0.12)',
              },
            }),
          },
        ],
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
            height: 40,
            color: theme.palette.text.primary,
            '& .hover-actions': {
              visibility: 'hidden',
            },
            '&:hover .hover-actions': {
              visibility: 'visible',
            },
            '&.selected': {
              backgroundColor: alpha(theme.palette.action.selected, 0.15),
            },
            '&.selected .hover-actions': {
              visibility: 'visible',
            },
          }),
        },
      },
    },
  });