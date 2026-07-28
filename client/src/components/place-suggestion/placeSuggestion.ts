import { isAnonymousUser } from '@/utils/isAnonymousUser'
import { type Editor } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { enqueueSnackbar } from 'notistack'
import type { PlaceItem, SuggestionListRef } from './PlaceSuggestionList'
import PlaceSuggestionList from './PlaceSuggestionList'
import { updatePosition } from './updatePosition'

// 1. Maintain a single session token instance out-of-scope or via a state container
let currentSessionToken: google.maps.places.AutocompleteSessionToken | null = null;
const ANONYMOUS_PLACE_CHIP_LIMIT = 5

let maxChipsSnackbarShown = false;

function countPlaceChips(editor: Editor): number {
  let count = 0
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'placeChip') count++
  })
  return count
}


export const placeSuggestion: Partial<SuggestionOptions<PlaceItem>> = {
  char: '@',
  allowSpaces: true,
  minQueryLength: 4,
  debounce: 1000,
  decorationClass: 'place-suggestion',
  decorationEmptyClass: 'is-empty',

  allow: ({ editor }) => {
    const blocked = isAnonymousUser() && countPlaceChips(editor) >= ANONYMOUS_PLACE_CHIP_LIMIT;
    if (!blocked) return true;

    if (!maxChipsSnackbarShown) {
      enqueueSnackbar("You've reached the maximum number of places for anonymous users. Sign in to add more.", { variant: 'warning' })
      maxChipsSnackbarShown = true
    }


    return false;
  },

  items: async ({ query, signal }): Promise<PlaceItem[]> => {
    if (!window.google?.maps?.places?.AutocompleteSuggestion) return []
    if (!query) return [] // return empty array, not early exit before dropdown mounts

    try {
      // 2. Lazily initialize a unique session token if it doesn't exist
      if (!currentSessionToken && window.google?.maps?.places?.AutocompleteSessionToken) {
        currentSessionToken = new google.maps.places.AutocompleteSessionToken();
        console.log('[places] new session token created')
      }

      // 3. Attach the native session token to the request payload
      const result = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        sessionToken: currentSessionToken ?? undefined,
      })

      if (signal.aborted) return [];

      return result.suggestions
        .filter((s) => s.placePrediction)
        .slice(0, 5)
        .map((s) => {
          const p = s.placePrediction!
          return {
            id: p.placeId,
            label: p.mainText?.toString() ?? p.text.toString(),
            secondaryText: p.secondaryText?.toString() ?? '',
            placeId: p.placeId,
            // 4. Pass down the underlying prediction object if you plan to call `toPlace()` 
            // and `fetchFields()` later on user selection to close the session bundle automatically.
            prediction: p,
          }
        })
    } catch (e) {
      console.error('Places error:', e)
      return []
    }
  },

  command: async ({ editor, range, props }) => {
    editor.chain().focus().insertContentAt(range, {
      type: 'placeChip',
      attrs: {
        id: props.placeId,
        label: props.label,
        secondaryText: props.secondaryText,
        loading: true,
      },
    }).run()

    try {
      const place = props.prediction.toPlace()
      await place.fetchFields({
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
      })

      editor.commands.updatePlaceChip(props.placeId, {
        label: place.displayName ?? props.label,
        address: place.formattedAddress,
        lat: place.location?.lat(),
        lng: place.location?.lng(),
        loading: false,
      })
    } catch (e) {
      console.error('fetchFields error:', e)
    } finally {
      console.log('[places] session closed, resetting token')
      currentSessionToken = null
    }
  },


  render: () => {
    let component: ReactRenderer<SuggestionListRef>

    return {
      onStart: props => {
        component = new ReactRenderer(PlaceSuggestionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        component.element.style.position = 'absolute'

        document.body.appendChild(component.element)

        updatePosition({ editor: props.editor, element: component.element })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        updatePosition({ editor: props.editor, element: component.element })

      },
      onKeyDown(props) {
        return component.ref?.onKeyDown(props) ?? false
      },
      onExit() {
        component.element.remove()
        component.destroy()
        // 5. CRITICAL: Clear the token when the UI overlay completely unmounts(session ends or is abandoned)
        currentSessionToken = null;
      },
    }
  },
}