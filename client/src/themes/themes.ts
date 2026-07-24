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
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
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
        },
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