import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useEffect, useState } from 'react'
import { supabase } from './clients/supabase'




export default function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function getNotes() {
      const { data: notes } = await supabase.from('notes').select('*');

      if (notes) {
        setNotes(notes)
      }
    }

    getNotes()
  }, [])

  console.log(notes)

  return <SimpleEditor />
}