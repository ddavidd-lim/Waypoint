import { useCallback, useMemo, useState } from 'react';
import type { Place } from '@/types/places';

function reorderByKeys(places: Place[], order: string[] | null): Place[] {
  if (!order) return places;

  const keyToPlace = new Map(places.map((p) => [p.key, p]));
  const used = new Set<string>();
  const orderedPlaces: Place[] = [];

  for (const key of order) {
    if (used.has(key)) continue; // skip duplicate keys (e.g. from drag-over updates)
    
    const place = keyToPlace.get(key);

    if (place) {
      orderedPlaces.push(place);
      used.add(key);
    }
  }

  // append any places not present in `order` at all
  const remaining = places.filter((p) => !used.has(p.key));
  return [...orderedPlaces, ...remaining];
}

export function useDraggablePlaces(places: Place[]) {
  const [order, setOrder] = useState<string[] | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());

  const orderedPlaces = useMemo(() => reorderByKeys(places, order), [places, order]);

  // Visible items are items that are not in the excluded set
  const activeOrderedPlaces = useMemo(
    () => orderedPlaces.filter((p) => !excluded.has(p.key)),
    [orderedPlaces, excluded]
  );

  const toggle = useCallback((id: string) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return { orderedPlaces, activeOrderedPlaces, excluded, toggle, setOrder };
}