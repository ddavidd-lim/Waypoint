export type LocationPin = { id: string; label: string };

export type Place = {
  key: string,
  location: google.maps.LatLngLiteral,
  name: string,
  address: string,
  city: string
  state: string
}