import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { supabase } from './clients/supabase';
import { initAuth } from './repositories/users';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

export default function App() {
  const [noteIds, setNoteIds] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState();

  useEffect(() => {
    async function getNotes() {
      const { data } = await supabase.from('notes').select('id').limit(1);
      console.log(data)
      if (data) {
        console.log(`Found ${data.length} notes`)

        const notes = data.map(note => note.id);
        setNoteIds(notes)
        setCurrentNoteId(notes[0])
      }
    }


    getNotes()
  }, [])


  useEffect(() => {
    initAuth();
    const hi = async () => {
      const user = await supabase.auth.getUser();
      console.log('Current user:', user);
    };
    hi();
  }, []);



  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100dvh', overflow: 'hidden' }}>
      <Box
        sx={{
          height: '100%',
          width: drawerWidth,
          flexShrink: 0,
          borderRight: '1px solid grey',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <Typography variant='subtitle1'>
          Current: {currentNoteId}
        </Typography>
        <Box sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
          <List>
            {noteIds.map(noteId => (
              <ListItemButton
              selected={noteId === currentNoteId}
              onClick={() => setCurrentNoteId(noteId)}>
                {noteId}
              </ListItemButton>
            ))}
          </List>
          <Button>
            Create New Note
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <SimpleEditor noteId={currentNoteId}/>
      </Box>
    </Box>
  );
}