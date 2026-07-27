import type { Place } from '@/types/places';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { DraggablePlace } from './DraggablePlace';

type Props = {
  items: Place[];
  excluded: Set<string>;
  onToggle: (key: string) => void;
  onOrderChange: (keys: string[]) => void;
}

export function PlaceReorder({ items, excluded, onToggle, onOrderChange }: Props) {
  const [draft, setDraft] = useState<Place[] | null>(null);
  const visible = draft ?? items;

  const commit = () => {
    if (draft) onOrderChange(draft.map((p) => p.key));
    setDraft(null);
  };

  let n = 0;
  const rows = visible.map((place) => {
    const included = !excluded.has(place.key);
    return { place, included, index: included ? ++n : undefined };
  });

  return (
    <Reorder.Group
      axis="y"
      values={visible}
      onReorder={setDraft}
      as="ul"
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {rows.map(({ place, index }) => (
        <DraggablePlace
          key={place.key}
          index={index}
          place={place}
          included={!excluded.has(place.key)}
          onToggle={onToggle}
          onCommit={commit}
        />
      ))}
    </Reorder.Group>
  );
}