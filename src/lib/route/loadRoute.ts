import type { RouteGeoJson } from '@/lib/route/types';

const routeUrl = `${import.meta.env.BASE_URL}mexico-walk-route.geojson`;

let cached: RouteGeoJson | null = null;

export async function loadWalkRoute(): Promise<RouteGeoJson> {
  if (cached) return cached;
  const res = await fetch(routeUrl);
  if (!res.ok) {
    throw new Error('Could not load walk route data.');
  }
  cached = (await res.json()) as RouteGeoJson;
  return cached;
}

export function getRouteLineCoordinates(route: RouteGeoJson): [number, number][] {
  const feature = route.features.find((f) => f.geometry.type === 'LineString');
  if (!feature || feature.geometry.type !== 'LineString') {
    throw new Error('Route LineString missing from GeoJSON.');
  }
  const coords = feature.geometry.coordinates;
  if (!Array.isArray(coords[0])) {
    throw new Error('Invalid LineString coordinates.');
  }
  return coords as [number, number][];
}
