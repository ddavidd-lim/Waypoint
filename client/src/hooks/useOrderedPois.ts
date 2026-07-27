import { useMemo, useState } from 'react';
import type { Poi } from '@/types/places';

export function useOrderedPois(pois: Poi[]) {
  const [order, setOrder] = useState<string[] | null>(null);

  const items = useMemo(() => {
    if (!order) return pois;
    const byKey = new Map(pois.map((p) => [p.key, p]));
    const ordered = order.flatMap((k) => byKey.get(k) ?? []);
    const seen = new Set(order);
    return [...ordered, ...pois.filter((p) => !seen.has(p.key))];
  }, [pois, order]);

  return { items, order, setOrder };
}