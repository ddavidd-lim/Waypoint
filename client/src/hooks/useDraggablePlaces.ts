import { useCallback, useMemo, useState } from 'react';
import type { Place } from '@/types/places';

function reorderByKeys(places: Place[], order: string[] | null): Place[] {
  if (!order) return places;

  const keyToPlace = new Map(places.map((p) => [p.key, p]));
  const orderedPlaces = order.flatMap((k) => keyToPlace.get(k) ?? []);
  const seen = new Set(order); // to exclude stray Places that are not ordered

  return [...orderedPlaces, ...places.filter((p) => !seen.has(p.key))];
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