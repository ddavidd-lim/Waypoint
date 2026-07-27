import { useRoute } from '@/hooks/useRoute';
import type { Poi } from '@/types/places';
import { AdvancedMarker, Map, Pin, Polyline, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useMemo } from 'react';

// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo



const PoiMarkers = ({ pois, allPois, route, autoPanEnabled }: { pois: Poi[]; allPois: Poi[]; route: google.maps.DirectionsResult | null, autoPanEnabled: boolean }) => {
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

type Props = {
  pois: Poi[],
  allPois: Poi[];
  showRoute: boolean
  autoPanEnabled: boolean
};
export function OverviewMap({ pois, allPois, showRoute, autoPanEnabled }: Props) {
  const { route } = useRoute(pois);

  return (
    <Map
      style={{ width: '100%', height: '250px', flexShrink: 0 }}
      mapId='DEMO_MAP_ID'
      defaultZoom={13}
      defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
    >
      <PoiMarkers pois={pois} allPois={allPois} route={showRoute ? route : null} autoPanEnabled={autoPanEnabled} />

      {/* https://visgl.github.io/react-google-maps/docs/api-reference/components/polyline */}
      {route && showRoute && (
        <Polyline
          path={route.routes[0].overview_path}
          strokeColor="#241ae8"
          strokeWeight={5}
          strokeOpacity={0.8}
        />
      )}
    </Map>
  )
}