import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'
import type { SuggestionProps } from '@tiptap/suggestion'

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
        top: rect.bottom + 8,
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
    
    if (!items.length) return createPortal(
      <div style={{ display: 'none' }} />,
      document.body
    )

    return createPortal(
      <div style={style} className="place-suggestion-list">
        {items.map((item, i) => (
          <button
            key={item.id}
            className={`place-suggestion-item ${i === selectedIndex ? 'selected' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault() // prevent editor blur
              command(item)
            }}
          >
            <span className="place-name">📍 {item.label}</span>
            <span className="place-secondary">{item.secondaryText}</span>
          </button>
        ))}
      </div>,
      document.body
    )
  }
)

export default PlaceSuggestionList