import type { Poi } from '@/types/places';
import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useMemo } from 'react';

// https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo

export const PoiMarkers = ({ pois, allPois, route, autoPanEnabled }: { pois: Poi[]; allPois: Poi[]; route: google.maps.DirectionsResult | null, autoPanEnabled: boolean }) => {
  const map = useMap();
  const activeKeys = useMemo(() => new Set(pois.map((p) => p.key)), [pois]);


  useEffect(() => {
    console.log('autoPan:', autoPanEnabled);
    if (!map || !autoPanEnabled || !pois.length) return;

    const routeBounds = route?.routes[0]?.bounds;
    if (routeBounds) {
      map.fitBounds(routeBounds, 40);
      return;
    }

    if (pois.length === 1) {
      map.panTo(pois[0].location);
      map.setZoom(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    pois.forEach((poi) => bounds.extend(poi.location));
    map.fitBounds(bounds, 40);
  }, [autoPanEnabled, map, pois, route]);

  return (
    <>
      {allPois.map((poi) => {
        const active = activeKeys.has(poi.key);
        const index = pois.findIndex((p) => p.key === poi.key);
        return (
          <AdvancedMarker key={poi.key} position={poi.location}>
            <Pin
              background={active ? '#e81a1a' : '#c0c0c0'}
              borderColor={active ? '#a20b0b' : '#9e9e9e'}
              glyphColor="#fff"
              glyphText={active ? String(index + 1) : ''}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
};