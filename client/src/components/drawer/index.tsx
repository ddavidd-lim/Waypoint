import { LEFT_DRAWER_WIDTH } from "@/constants.ts/drawerWidth";
import { useUser } from "@/hooks/useUser";
import { createNote } from "@/repositories/notes";
import { supabase } from "@/services/supabase";
import type { Note } from "@/types/db";
import AddIcon from '@mui/icons-material/AddOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuContent from "./MenuContent";
import NoteEllipsisMenu from "./NoteEllipsisMenu";
import ProfileMenu from "./ProfileMenu";
import Logo from '/waypoint_logo_3d.png';

const Drawer = styled(MuiDrawer)({
  width: LEFT_DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: LEFT_DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
});


type Props = {
  handleSelectCurrentNoteId: (noteId: string) => void;
  currentNoteId: string;
  handleDrawerClose: () => void;
  open: boolean;
}

export default function NotesDrawer({ handleSelectCurrentNoteId, currentNoteId, handleDrawerClose, open }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [noteMenuAnchor, setNoteMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  
  const [menuNoteId, setMenuNoteId] = useState<string | null>(null);
  
  const { data: user } = useUser();
  
  const queryClient = useQueryClient();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data } = await supabase
      .from('notes')
      .select()
      .order("created_at", { ascending: true });
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
  
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user');
      const { data, error } = await createNote('', user.id);
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' });
      handleSelectCurrentNoteId(data.id);
    },
    onError: (error) => {
      console.log(`Failed to create note: ${error}`);
    },
  });

  const handleNoteMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>, noteId: string) => {
    e.stopPropagation();
    setNoteMenuAnchor(e.currentTarget);
    setMenuNoteId(noteId);
  }, []);

  const handleProfileMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    setProfileMenuAnchor(e.currentTarget);
  }, [])

  const handleNoteMenuClose = () => {
    setNoteMenuAnchor(null);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleProfileMenuClose();
    await queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' });
    await queryClient.invalidateQueries({ queryKey: ['note'] });
    await queryClient.invalidateQueries({ queryKey: ['current-user'] });
    navigate('/');
  }




  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      sx={{
        width: LEFT_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: LEFT_DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {/* New Notes + Logo */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between'
        }}
      >
        <Box
          component="img"
          sx={{
            height: '25px',
            width: '25px',
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt="Waypoint Logo"
          src={Logo}
        />
        <Stack direction={'row'} spacing={2}>
          <Button
            fullWidth
            variant="text"
            endIcon={<AddIcon />}
            onClick={() => createMutation.mutateAsync()}
            sx={{
              justifyContent: 'flex-start',
            }}
          >
            New note
          </Button>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
          </IconButton>
        </Stack>
      </Stack>
            
      {/* Notes List */}
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent
          notes={notes}
          handleSelectCurrentNoteId={handleSelectCurrentNoteId}
          currentNoteId={currentNoteId}
          onMenuOpen={handleNoteMenuOpen}
        />
      </Box>

      {/* Profile */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title={user?.is_anonymous ? "Sign in" : "Account settings"}>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open}
          >
            <Avatar
              sizes="small"
              alt="Wavid Wim"
              src="/cockatoo2.jpg"
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px', color: 'text.secondary' }}>
            {user?.is_anonymous ? 'Anonymous cockatoo' : user?.email}
          </Typography>
        </Box>
      </Stack>

      {/* Triple dot menu */}
      <NoteEllipsisMenu
        anchorEl={noteMenuAnchor}
        handleNoteMenuClose={handleNoteMenuClose}
        noteId={menuNoteId}
        handleSelectCurrentNoteId={handleSelectCurrentNoteId}
        currentNoteId={currentNoteId}
      />

      {/* Profile Menu */}
      <ProfileMenu
        anchorEl={profileMenuAnchor}
        handleProfileMenuClose={handleProfileMenuClose}
        handleLogout={handleLogout}
      />
    </Drawer >
  );
}