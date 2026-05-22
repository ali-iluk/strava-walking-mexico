export type RouteGeoJson = {
  type: 'FeatureCollection';
  metadata: {
    distanceKm: number;
    direction: string;
    source: string;
    waypoints: { name: string; lng: number; lat: number }[];
  };
  features: Array<{
    type: 'Feature';
    properties: { name?: string; role?: string; distanceKm?: number };
    geometry: {
      type: 'LineString' | 'Point';
      coordinates: [number, number] | [number, number][];
    };
  }>;
};

export type LngLat = [number, number];
export type LatLng = [number, number];
