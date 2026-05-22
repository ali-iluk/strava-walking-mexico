import type { LatLng, LngLat } from '@/lib/route/types';

const EARTH_RADIUS_M = 6_371_000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in meters between [lng, lat] points */
export function segmentLengthMeters(a: LngLat, b: LngLat): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function buildCumulativeMeters(coords: LngLat[]): number[] {
  const cumulative = [0];
  for (let i = 1; i < coords.length; i++) {
    cumulative.push(cumulative[i - 1]! + segmentLengthMeters(coords[i - 1]!, coords[i]!));
  }
  return cumulative;
}

export function lngLatToLatLng([lng, lat]: LngLat): LatLng {
  return [lat, lng];
}

export function pointAlongRoute(
  coords: LngLat[],
  cumulativeMeters: number[],
  progress: number,
): { position: LatLng; distanceKm: number; totalKm: number } {
  const totalM = cumulativeMeters[cumulativeMeters.length - 1] ?? 0;
  const clamped = Math.max(0, Math.min(1, progress));
  const targetM = clamped * totalM;

  if (targetM <= 0) {
    const start = coords[0]!;
    return {
      position: lngLatToLatLng(start),
      distanceKm: 0,
      totalKm: totalM / 1000,
    };
  }

  if (targetM >= totalM) {
    const end = coords[coords.length - 1]!;
    return {
      position: lngLatToLatLng(end),
      distanceKm: totalM / 1000,
      totalKm: totalM / 1000,
    };
  }

  let lo = 0;
  let hi = cumulativeMeters.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (cumulativeMeters[mid]! < targetM) lo = mid;
    else hi = mid;
  }

  const segStart = cumulativeMeters[lo]!;
  const segEnd = cumulativeMeters[hi]!;
  const segLen = segEnd - segStart || 1;
  const t = (targetM - segStart) / segLen;
  const [lng1, lat1] = coords[lo]!;
  const [lng2, lat2] = coords[hi]!;

  return {
    position: [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t],
    distanceKm: targetM / 1000,
    totalKm: totalM / 1000,
  };
}
