import PlaceIcon from '@mui/icons-material/Place'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { SuggestionProps } from '@tiptap/suggestion'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'

export interface PlaceItem {
  id: string
  label: string
  secondaryText: string
  placeId: string
}

export interface SuggestionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const PlaceSuggestionList = forwardRef<SuggestionListRef, SuggestionProps<PlaceItem>>(
  ({ items, command, clientRect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index]

      if (item) {
        command(items[selectedIndex])
      }
    }

    const rect = clientRect?.()
    const style = rect
      ? {
        position: 'fixed' as const,
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 9999,
      }
      : { display: 'none' }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [items])

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }) {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true
        }
        if (event.key === 'ArrowDown') {
          downHandler();
          return true
        }
        if (event.key === 'Enter') {
          enterHandler();
          return true
        }
        return false
      },
    }))

    return createPortal(
      <Paper
        style={style}
        elevation={8}
        sx={{
          minWidth: 280,
          maxWidth: 400,
          maxHeight: 320,
          overflowY: 'auto',
          borderRadius: 1,
        }}
      >
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Searching…
            </Typography>
          </Box>
        ) : (
          <MenuList dense disablePadding>
            {items.map((item, i) => (
              <MenuItem
                key={item.id}
                selected={i === selectedIndex}
                onMouseDown={(e) => {
                  e.preventDefault()
                  command(item)
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <PlaceIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.secondaryText}
                  slotProps={{
                    primary: { variant: 'body2', noWrap: true, sx: { fontWeight: 500 } },
                    secondary: { variant: 'caption', noWrap: true },
                  }}

                />
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Paper>,
      document.body
    )
  }
)

export default PlaceSuggestionList