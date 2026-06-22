
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import Notes from './pages/notes';
import Box from '@mui/material/Box';

const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: 'flex', width: '100%', height: '100dvh', overflow: 'hidden' }}>
        <Notes />
      </Box>
    </QueryClientProvider>
  );
}