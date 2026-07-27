import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import type { Poi } from '@/types/places';

const MAX_STOPS = 27;

type Route =
  | { status: 'ok'; result: google.maps.DirectionsResult }
  | { status: 'error'; message: string };

export function useRoute(pois: Poi[], enabled = true) {
  const routesLib = useMapsLibrary('routes');
  const [routesCache, setRoutesCache] = useState<Record<string, Route>>({});
  const requested = useRef(new Set<string>());

  const cacheKey = pois.map((p) => p.key).join('|');

  const active = enabled && Boolean(routesLib) && pois.length >= 2;
  const route = active ? routesCache[cacheKey] : undefined;

  useEffect(() => {
    if (!active || !routesLib) return;

    if (requested.current.has(cacheKey)) return;

    requested.current.add(cacheKey);

    const trimmed = pois.slice(0, MAX_STOPS);
    const service = new routesLib.DirectionsService();

    service
      .route({
        origin: trimmed[0].location,
        destination: trimmed[trimmed.length - 1].location,
        waypoints: trimmed.slice(1, -1).map((p) => ({
          location: p.location,
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((result) => {
        setRoutesCache((prev) => ({ ...prev, [cacheKey]: { status: 'ok', result } }));
      })
      .catch((e: unknown) => {
        requested.current.delete(cacheKey); // allow a retry
        setRoutesCache((prev) => ({
          ...prev,
          [cacheKey]: {
            status: 'error',
            message: e instanceof Error ? e.message : 'Route unavailable',
          },
        }));
      });
  }, [active, routesLib, pois, cacheKey]);

  return {
    route: route?.status === 'ok' ? route.result : null,
    error: route?.status === 'error' ? route.message : null,
    loading: active && !route,
    truncated: pois.length > MAX_STOPS,
  };
}