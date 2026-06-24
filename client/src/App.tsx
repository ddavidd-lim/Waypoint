
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import Notes from './pages/notes';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

export default function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider autoHideDuration={3000} maxSnack={4} action={(id) => (
        <IconButton onClick={() => closeSnackbar(id)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      />
      <QueryClientProvider client={queryClient}>
        <Box sx={{ display: 'flex', width: '100%', height: '100dvh', overflow: 'hidden' }}>
          <Notes />
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}