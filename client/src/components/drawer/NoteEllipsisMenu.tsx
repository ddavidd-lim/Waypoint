import { deleteNote } from "@/repositories/notes";
import type { Note } from "@/types/db";
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";


type Props = {
  anchorEl: HTMLElement | null;
  noteId: string | null;
  handleNoteMenuClose: () => void;
  currentNoteId: string;
  handleSelectCurrentNoteId: (noteId: string) => void;
}
export default function NoteEllipsisMenu({ anchorEl, noteId, handleNoteMenuClose, currentNoteId, handleSelectCurrentNoteId }: Props) {
  const queryClient = useQueryClient();


  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData(['notes']);

      return { previous };
    },

    onError: (_err, _id, context) => {
      queryClient.setQueryData(['notes'], context?.previous);
    },

    onSuccess: () => {
      const updatedNotes: Note[] = queryClient.getQueryData(['notes']) ?? [];
      if (currentNoteId === noteId && updatedNotes.length > 0) {
        handleSelectCurrentNoteId(updatedNotes[updatedNotes.length - 1].id);
      }
      handleNoteMenuClose();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      enqueueSnackbar(`Deleted note ${noteId}`)
    },
  });
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleNoteMenuClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
    >
      <MenuItem
        onClick={() => noteId && deleteMutation.mutate(noteId)}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  )
}