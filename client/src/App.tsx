
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthProvider';
import { useDarkMode } from './context/theme-toggle/dark-mode-context';
import { router } from './routers';
import { getTheme } from './themes/themes';


const queryClient = new QueryClient();

export default function App() {
  const { isDarkMode } = useDarkMode();

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  return (
    // https://visgl.github.io/react-google-maps/docs/api-reference/components/api-provider
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places', 'marker']}
      onLoad={() => console.log('Maps API has loaded.')}>

      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SnackbarProvider autoHideDuration={1500} maxSnack={4} action={(id) => (
            <IconButton variant='noteMenu' onClick={() => closeSnackbar(id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          />
          <QueryClientProvider client={queryClient}>
            <Box sx={{ display: 'flex', width: '100%', height: '100dvh', overflow: 'hidden' }}>
              <RouterProvider router={router} />
            </Box>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>

    </APIProvider>
  );
}