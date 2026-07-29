export type Place = {
  key: string;        // unique per pin — list identity (React key, Reorder value, order, excluded)
  placeId: string;    // the Google Places API place ID
  location: google.maps.LatLngLiteral,
  name: string,
  address: string,
  city: string;
  state: string;
};