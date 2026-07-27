import { useCallback, useMemo, useState } from 'react';
import type { Poi } from '@/types/places';

function reorderByKeys(pois: Poi[], order: string[] | null): Poi[] {
  if (!order) return pois;

  const keyToPoi = new Map(pois.map((p) => [p.key, p]));
  const orderedPois = order.flatMap((k) => keyToPoi.get(k) ?? []);
  const seen = new Set(order); // to exclude stray Pois that are not ordered

  return [...orderedPois, ...pois.filter((p) => !seen.has(p.key))];
}

export function useDraggablePois(pois: Poi[]) {
  const [order, setOrder] = useState<string[] | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());

  const orderedPois = useMemo(() => reorderByKeys(pois, order), [pois, order]);

  // Visible items are items that are not in the excluded set
  const activeOrderedPois = useMemo(
    () => orderedPois.filter((p) => !excluded.has(p.key)),
    [orderedPois, excluded]
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

  return { orderedPois, activeOrderedPois, excluded, toggle, setOrder };
}