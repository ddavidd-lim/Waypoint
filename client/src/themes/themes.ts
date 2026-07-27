import { createTheme, alpha } from '@mui/material/styles';

export const getTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#191919' : '#fafafa',
        paper: isDarkMode ? '#202020' : '#ffffff',
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
              color: theme.palette.text.secondary,
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
        variants: [
          {
            props: { variant: 'noteMenu' },
            style: ({ theme }) => ({
              borderRadius: 6,
              color: theme.palette.text.secondary,
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
            color: theme.palette.text.secondary,
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