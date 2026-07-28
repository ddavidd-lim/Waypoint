import { useRoute } from '@/hooks/useRoute';
import type { Place } from '@/types/places';
import { Map, Polyline } from '@vis.gl/react-google-maps';
import { PlaceMarkers } from './PlaceMarkers';

// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js

type Props = {
  places: Place[],
  allPlaces: Place[];
  showRoute: boolean
  autoPanEnabled: boolean
};
export function OverviewMap({ places, allPlaces, showRoute, autoPanEnabled }: Props) {
  const { route } = useRoute(places);

  return (
    <Map
      style={{ width: '100%', height: '250px', flexShrink: 0 }}
      mapId='DEMO_MAP_ID'
      defaultZoom={13}
      defaultCenter={{ lat: 34.0522, lng: -118.2437 }}
    >
      <PlaceMarkers places={places} allPlaces={allPlaces} route={showRoute ? route : null} autoPanEnabled={autoPanEnabled} />

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