import { useDarkMode } from '@/context/theme-toggle/dark-mode-context';
import type { Note } from '@/types/db';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IosShareIcon from '@mui/icons-material/IosShare';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import { SaveIndicator } from './SaveIndicator';
import type { SaveState } from './SaveIndicator/types';

type Props = {
  handleLeftDrawerOpen: () => void;
  handleRightDrawerOpen: () => void;
  openLeftDrawer: boolean;
  openRightDrawer: boolean;
  selectedNote?: Note;
  saveState: SaveState;
};

export default function Header({ handleLeftDrawerOpen, handleRightDrawerOpen, openLeftDrawer, openRightDrawer, selectedNote, saveState }: Props) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleShare = () => {
    // TODO: is_shared + /shared/:id
    enqueueSnackbar('Sharing coming soon', { variant: 'info' });
  };


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        minHeight: 56,
        top: 0,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Left Drawer button*/}
      <IconButton
        variant="noteMenu"
        color="inherit"
        onClick={handleLeftDrawerOpen}
        sx={{
          opacity: openLeftDrawer ? 0 : 1,
          pointerEvents: openLeftDrawer ? 'none' : 'auto',
          transition: 'opacity 225ms cubic-bezier(0.0, 0, 0.2, 1)',
          transitionDelay: openLeftDrawer ? '0ms' : '225ms',
        }}
      >
        <KeyboardDoubleArrowRightIcon />
      </IconButton>

      {/* Current note title */}
      <Typography
        variant="body2"
        noWrap
        sx={{ flex: 1, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }} // flex:1 takes up the empty space
      >
        {selectedNote?.title || 'Untitled'}
      </Typography>

      {/* Right drawer + actions */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <SaveIndicator state={saveState} updatedAt={dayjs(selectedNote?.updated_at).format('MM/DD/YYYY, h:mm A')} />
        <Tooltip title="Share">
          <IconButton onClick={handleShare}><IosShareIcon /></IconButton>
        </Tooltip>
        <Tooltip title={isDarkMode ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleDarkMode}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        {isMobile && (
          <Tooltip title="Show map">
            <IconButton
              variant="noteMenu"
              onClick={handleRightDrawerOpen}
              sx={{
                opacity: openRightDrawer ? 0 : 1,
                pointerEvents: openRightDrawer ? 'none' : 'auto',
                transition: 'opacity 225ms cubic-bezier(0.0, 0, 0.2, 1)',
                transitionDelay: openRightDrawer ? '0ms' : '225ms',
              }}
            >
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}