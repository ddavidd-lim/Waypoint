import type { Place } from '@/types/places';
import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useMemo } from 'react';

// https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo

type Props = {
  places: Place[];
  allPlaces: Place[];
  route: google.maps.DirectionsResult | null;
  autoPanEnabled: boolean
}
export const PlaceMarkers = ({ places, allPlaces, route, autoPanEnabled }: Props) => {
  const map = useMap();
  const activeKeys = useMemo(() => new Set(places.map((p) => p.key)), [places]);


  useEffect(() => {
    console.log('autoPan:', autoPanEnabled);
    if (!map || !autoPanEnabled || !places.length) return;

    const routeBounds = route?.routes[0]?.bounds;
    if (routeBounds) {
      map.fitBounds(routeBounds, 40);
      return;
    }

    if (places.length === 1) {
      map.panTo(places[0].location);
      map.setZoom(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => bounds.extend(place.location));
    map.fitBounds(bounds, 40);
  }, [autoPanEnabled, map, places, route]);

  return (
    <>
      {allPlaces.map((place) => {
        const active = activeKeys.has(place.key);
        const index = places.findIndex((p) => p.key === place.key);
        return (
          <AdvancedMarker key={place.key} position={place.location}>
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