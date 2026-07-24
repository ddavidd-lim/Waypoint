/* eslint-disable react-hooks/exhaustive-deps */
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import NotesDrawer from '@/components/drawer';
import OverviewMapDrawer from '@/components/drawer/OverviewMapDrawer';
import { useUser } from '@/hooks/useUser';
import { createNote } from '@/repositories/notes';
import { supabase } from '@/services/supabase';
import type { Note } from '@/types/db';
import type { Place } from '@/types/places';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { AuthContext } from '@/context/auth/authContext';
import { showSignInSnackbar } from '@/utils/showSignInSnackbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { closeSnackbar } from 'notistack';
import welcomeContent from '../components/tiptap-templates/simple/data/welcome-content.json';
import { Main } from '@/components/main';
import { useNavigate, useParams } from 'react-router-dom';


export default function Notes() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const isCreating = useRef(false);

  const { id: selectedNoteId } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [places, setPlaces] = useState<Place[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelectCurrentNoteId = useCallback((noteId: string) => {
    navigate(`/notes/${noteId}`);
  }, []);

  const { user: authUser } = useContext(AuthContext)

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
    isCreating.current = false;
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

  return (
    <>
      <NotesDrawer
        currentNoteId={currentNoteId ?? ''}
        handleSelectCurrentNoteId={handleSelectCurrentNoteId}
        open={openLeftDrawer}
        handleDrawerClose={handleLeftDrawerClose}
      />

      <Main openLeft={openLeftDrawer} openRight={openRightDrawer}>
        <Stack direction={'row'} sx={{ height: 1, width: 1 }}>

          <IconButton
            color="inherit"
            onClick={handleLeftDrawerOpen}
            sx={{
              position: 'absolute',
              left: { xs: 0, sm: 8 },
              top: { xs: '50%', sm: 50 },
              zIndex: 1300,
              opacity: openLeftDrawer ? 0 : 1,
              pointerEvents: openLeftDrawer ? 'none' : 'auto',
              transition: 'opacity 225ms cubic-bezier(0.0, 0, 0.2, 1)',
              transitionDelay: openLeftDrawer ? '0ms' : '225ms',
            }}
          >
            <KeyboardDoubleArrowRightIcon />
          </IconButton>

          <SimpleEditor key={currentNoteId} noteId={currentNoteId} setPlaces={setPlaces} />

          <IconButton
            onClick={handleRightDrawerOpen}
            sx={{
              position: 'absolute',
              right: { xs: 0, sm: 8 },
              top: { xs: '50%', sm: 50 },
              zIndex: 1300,
              opacity: openRightDrawer ? 0 : 1,
              pointerEvents: openRightDrawer ? 'none' : 'auto',
              transition: 'opacity 225ms cubic-bezier(0.0, 0, 0.2, 1)',
              transitionDelay: openRightDrawer ? '0ms' : '225ms',
            }}
          >
            <KeyboardDoubleArrowLeftIcon />
          </IconButton>
        </Stack>
      </Main>

      <OverviewMapDrawer
        places={places}
        open={openRightDrawer}
        handleDrawerClose={handleRightDrawerClose}
      />
    </>
  );
}