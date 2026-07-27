import { useRoute } from '@/hooks/useRoute';
import type { Poi } from '@/types/places';
import { AdvancedMarker, Map, Pin, Polyline, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
// https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo



const PoiMarkers = ({ pois, route }: { pois: Poi[]; route: google.maps.DirectionsResult | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !pois.length) return;

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
  }, [map, pois, route]);

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};

type Props = {
  pois: Poi[],
  showRoute: boolean
};
export function OverviewMap({ pois, showRoute }: Props) {
  const { route } = useRoute(pois);

  return (
    <Map
      style={{ width: '100%', height: '250px', flexShrink: 0 }}
      mapId='DEMO_MAP_ID'
      defaultZoom={13}
      defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
    >
      <PoiMarkers pois={pois} route={route} />

      {/* https://visgl.github.io/react-google-maps/docs/api-reference/components/polyline */}
      {route && showRoute && (
        <Polyline
          path={route.routes[0].overview_path}
          strokeColor="#1a73e8"
          strokeWeight={5}
          strokeOpacity={0.8}
        />
      )}
    </Map>
  )
}