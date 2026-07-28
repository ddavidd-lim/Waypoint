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
  const [draftKeys, setDraftKeys] = useState<string[] | null>(null);

  const keyOrder = draftKeys ?? items.map((p) => p.key);
  const placeLookup = new Map(items.map((p) => [p.key, p]));

  const commit = () => {
    if (draftKeys) onOrderChange(draftKeys);
    setDraftKeys(null);
  };

  let n = 0;
  const rows = keyOrder.map((key) => {
    const place = placeLookup.get(key)!;
    const included = !excluded.has(key);
    return { place, included, index: included ? ++n : undefined };
  });

  return (
    <Reorder.Group
      axis="y"
      values={keyOrder}
      onReorder={setDraftKeys}
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