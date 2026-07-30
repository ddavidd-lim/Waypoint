/* eslint-disable react-hooks/exhaustive-deps */
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import NotesDrawer from '@/components/drawer/NotesDrawer';
import OverviewMapDrawer from '@/components/drawer/OverviewMapDrawer';
import { useUser } from '@/hooks/useUser';
import { createNote } from '@/repositories/notes';
import { supabase } from '@/services/supabase';
import type { Note } from '@/types/db';
import type { LocationPin } from "@/types/location-pin";
import { useTheme } from '@mui/material/styles';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import Header from '@/components/Header';
import { Main } from '@/components/main';
import type { SaveState } from '@/components/SaveIndicator/types';
import { AuthContext } from '@/context/auth/authContext';
import { showSignInSnackbar } from '@/utils/showSignInSnackbar';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { closeSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import welcomeContent from '../components/tiptap-templates/simple/data/welcome-content.json';
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from '@mui/icons-material/Map';

const RAIL_WIDTH = 48;

export default function Notes() {
  const queryClient = useQueryClient();
  const { id: selectedNoteId } = useParams<{ id: string; }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: user } = useUser();

  const isCreating = useRef(false);

  const [pin, setPins] = useState<LocationPin[]>([]);

  const [saveState, setSaveState] = useState<SaveState>('idle');

  const handleSelectCurrentNoteId = useCallback((noteId: string) => {
    navigate(`/notes/${noteId}`);
  }, []);

  const { user: authUser } = useContext(AuthContext);

  const { data: notes, isSuccess } = useQuery<Note[]>({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('notes')
        .select()
        .order("created_at", { ascending: true });
      return data ?? [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const currentNoteId = selectedNoteId ?? notes?.[0]?.id;

  // Redirect to /notes/:id once we know which note to show, if the URL doesn't already have one
  useEffect(() => {
    if (selectedNoteId) return;        // URL already has an id, nothing to do
    if (!isSuccess) return;            // notes haven't loaded yet
    if (!notes?.[0]?.id) return;       // no notes to redirect to yet (e.g. still creating one)

    navigate(`/notes/${notes[0].id}`, { replace: true });
  }, [selectedNoteId, isSuccess, notes, navigate]);


  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user');
      const { data, error } = await createNote('👋 Welcome to Waypoint', user.id, welcomeContent);
      if (error) throw error;
      return data;

    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' });
      navigate(`/notes/${data.id}`);
    },
    onError: (error) => {
      console.log(`Failed to create note: ${error}`);
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    if (!isSuccess) return;
    if (notes.length > 0) return;
    if (isCreating.current) return;

    isCreating.current = true;

    createMutation.mutate();
  }, [user?.id, isSuccess, notes?.length]);

  useEffect(() => {
    if (!authUser?.is_anonymous) return;

    const key = showSignInSnackbar();

    return () => {
      closeSnackbar(key);
    };
  }, [authUser]);

  // Reset creation of first note if the user changes: sign-in + login + logout
  useEffect(() => {
    if (!user?.id) isCreating.current = false;
  }, [user?.id]);

  // Left Drawer state
  const [openLeftDrawer, setOpenLeftDrawer] = useState(isMobile ? false : true);

  const handleLeftDrawerOpen = () => {
    setOpenLeftDrawer(true);
  };

  const handleLeftDrawerClose = () => {
    setOpenLeftDrawer(false);
  };

  // Right Drawer State
  const [openRightDrawer, setOpenRightDrawer] = useState(false);

  const handleRightDrawerOpen = () => {
    setOpenRightDrawer(true);
  };

  const handleRightDrawerClose = () => {
    setOpenRightDrawer(false);
  };

  // Note to pass to Header
  const note = notes?.find((n) => n.id === currentNoteId);

  return (
    <>
      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: RAIL_WIDTH,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1,
            gap: 0.5,
          }}
        >
          <IconButton variant='noteMenu' onClick={openLeftDrawer ? handleLeftDrawerClose : handleLeftDrawerOpen}>
            {openLeftDrawer ? <KeyboardDoubleArrowLeftIcon /> : <FolderIcon />}
          </IconButton>
        </Box >
      )
      }
      <NotesDrawer
        currentNoteId={currentNoteId ?? ''}
        handleSelectCurrentNoteId={handleSelectCurrentNoteId}
        open={openLeftDrawer}
        handleDrawerClose={handleLeftDrawerClose}
      />

      <Main openLeft={openLeftDrawer} openRight={openRightDrawer}>
        <Box sx={{ height: 1, width: 1 }}>

          <Header saveState={saveState} openLeftDrawer={openLeftDrawer} openRightDrawer={openRightDrawer} handleLeftDrawerOpen={handleLeftDrawerOpen} handleRightDrawerOpen={handleRightDrawerOpen} selectedNote={note} />

          <SimpleEditor key={currentNoteId} noteId={currentNoteId} setPins={setPins} setSaveState={setSaveState} />
        </Box>
      </Main>

      <OverviewMapDrawer
        pins={pin}
        open={openRightDrawer}
        handleDrawerClose={handleRightDrawerClose}
      />

      {!isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: RAIL_WIDTH,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 1,
            gap: 0.5,
          }}
        >
          <IconButton variant='noteMenu' onClick={openRightDrawer ? handleRightDrawerClose : handleRightDrawerOpen}>
            {openRightDrawer ? <KeyboardDoubleArrowRightIcon /> : <MapIcon />}
          </IconButton>
        </Box >
      )
      }
    </>
  );
}