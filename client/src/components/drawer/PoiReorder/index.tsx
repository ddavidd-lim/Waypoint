import type { Poi } from '@/types/places';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { DraggablePoi } from './DraggablePoi';

type Props = {
  items: Poi[];
  excluded: Set<string>;
  onToggle: (key: string) => void;
  onOrderChange: (keys: string[]) => void;
}

export function PoiReorder({ items, excluded, onToggle, onOrderChange }: Props) {
  const [draft, setDraft] = useState<Poi[] | null>(null);
  const visible = draft ?? items;

  const commit = () => {
    if (draft) onOrderChange(draft.map((p) => p.key));
    setDraft(null);
  };

  let n = 0;
  const rows = visible.map((poi) => {
    const included = !excluded.has(poi.key);
    return { poi, included, index: included ? ++n : undefined };
  });

  return (
    <Reorder.Group
      axis="y"
      values={visible}
      onReorder={setDraft}
      as="ul"
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {rows.map(({ poi, index }) => (
        <DraggablePoi
          key={poi.key}
          index={index}
          poi={poi}
          included={!excluded.has(poi.key)}
          onToggle={onToggle}
          onCommit={commit}
        />
      ))}
    </Reorder.Group>
  );
}