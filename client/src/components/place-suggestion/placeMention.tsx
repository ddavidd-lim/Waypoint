import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { PlaceChip } from "@/components/place-suggestion/PlaceChip"
import Mention, { type MentionOptions } from "@tiptap/extension-mention"
import type { ActivePlace } from "./types"
import type { PlaceItem } from "./PlaceSuggestionList"

interface PlaceMentionOptions extends MentionOptions<PlaceItem> {
  onChipClick: (place: ActivePlace, anchor: HTMLElement) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    placeChip: {
      updatePlaceChip: (placeId: string, attrs: Record<string, unknown>) => ReturnType
    }
  }
}

export const PlaceMention = Mention.extend<PlaceMentionOptions>({
  name: 'placeChip', // was implicitly 'mention' — must match insertContentAt's `type`

  addOptions() {
    return {
      ...this.parent?.(),
      onChipClick: () => { },
    } as PlaceMentionOptions
  },

  addAttributes() {
    return {
      ...this.parent?.(), // keeps Mention's built-in `id` and `label`
      secondaryText: {
        default: null,
        parseHTML: element => element.getAttribute('data-secondary-text'),
        renderHTML: attributes => ({ 'data-secondary-text': attributes.secondaryText }),
      },
      loading: {
        default: false,
        parseHTML: element => element.getAttribute('data-loading') === 'true',
        renderHTML: attributes => ({ 'data-loading': attributes.loading ? 'true' : 'false' }),
      },
      address: {
        default: null,
        parseHTML: element => element.getAttribute('data-address'),
        renderHTML: attributes => ({ 'data-address': attributes.address }),
      },
      lat: {
        default: null,
        parseHTML: element => {
          const v = element.getAttribute('data-lat')
          return v === null ? null : Number(v)
        },
        renderHTML: attributes => ({ 'data-lat': attributes.lat }),
      },
      lng: {
        default: null,
        parseHTML: element => {
          const v = element.getAttribute('data-lng')
          return v === null ? null : Number(v)
        },
        renderHTML: attributes => ({ 'data-lng': attributes.lng }),
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      updatePlaceChip:
        (placeId, attrs) =>
          ({ tr, dispatch, state }) => {
            let updated = false

            state.doc.descendants((node, pos) => {
              if (updated) return false
              if (node.type.name === this.name && node.attrs.id === placeId) {
                if (dispatch) tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs })
                updated = true
                return false
              }
            })

            return updated
          },
    }
  },

  addNodeView() {
    const { onChipClick } = this.options

    return ReactNodeViewRenderer(({ node }) => (
      <NodeViewWrapper as="span">
        <PlaceChip
          label={node.attrs.label}
          onClick={(anchor) =>
            onChipClick(
              {
                anchor,
                placeId: node.attrs.id,
                label: node.attrs.label,
                secondaryText: node.attrs.secondaryText ?? '',
              },
              anchor
            )
          }
        />
      </NodeViewWrapper>
    ))
  },
})