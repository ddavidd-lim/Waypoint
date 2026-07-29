import { useQuery } from '@tanstack/react-query';
import type { Place } from '@/types/places';
import type { LocationPin } from "@/types/location-pin";

export function usePlaces(pins: LocationPin[]) {
  const queryKey = pins.map(p => p.id).join(',');

  return useQuery({
    queryKey: ['places', queryKey],
    queryFn: async () => {
      // Fetch each distinct place only once, even if several pins reference it
      const uniqueIds = [...new Set(pins.map(p => p.id))];

      const fetches = await Promise.allSettled(
        uniqueIds.map(async (id) => {
          const place = new google.maps.places.Place({ id });
          await place.fetchFields({ fields: ['location', 'addressComponents', 'displayName', 'formattedAddress'] });

          return {
            placeId: id,
            location: { lat: place.location!.lat(), lng: place.location!.lng() },
            name: place.displayName ?? '',
            address: place.formattedAddress ?? '',
            city: place.addressComponents?.find(c => c.types.includes('locality'))?.longText ?? '',
            state: place.addressComponents?.find(c => c.types.includes('administrative_area_level_1'))?.shortText ?? '',
          };
        })
      );

      const byId = new Map(
        fetches
          .filter((r): r is PromiseFulfilledResult<{ placeId: string; } & Omit<Place, 'key' | 'placeId'>> => r.status === 'fulfilled')
          .map(r => [r.value.placeId, r.value])
      );

      // One Place per pin, so each pin gets its own unique `key` — even
      // when multiple pins resolve to the same physical place.
      return pins
        .map((pin, index) => {
          const details = byId.get(pin.id);
          if (!details) return null;
          return { key: `${pin.id}-${index}`, ...details } as Place;
        })
        .filter((p): p is Place => p !== null);
    },
    enabled: pins.length > 0,
    staleTime: Infinity,
  });
}
