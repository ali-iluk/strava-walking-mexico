import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import { formatSteps } from '@/hooks/useAnimatedNumber';
import { buildCumulativeMeters, lngLatToLatLng, pointAlongRoute } from '@/lib/route/geometry';
import { getRouteLineCoordinates, loadWalkRoute } from '@/lib/route/loadRoute';
import { GOAL_STEPS } from '@/lib/storage/types';

type RouteMapProps = {
  totalSteps: number;
};

function FitBounds({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [28, 28] });
    }
  }, [map, positions]);
  return null;
}

export function RouteMap({ totalSteps }: RouteMapProps) {
  const [error, setError] = useState<string | null>(null);
  const [routeMeta, setRouteMeta] = useState<{ distanceKm: number } | null>(null);
  const [lineLatLngs, setLineLatLngs] = useState<L.LatLngExpression[]>([]);
  const [cumulative, setCumulative] = useState<number[]>([]);
  const [rawCoords, setRawCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const route = await loadWalkRoute();
        const coords = getRouteLineCoordinates(route);
        setRawCoords(coords);
        setLineLatLngs(coords.map(lngLatToLatLng));
        setCumulative(buildCumulativeMeters(coords));
        setRouteMeta({ distanceKm: route.metadata.distanceKm });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load route.');
      }
    })();
  }, []);

  const progress = totalSteps / GOAL_STEPS;

  const { youPosition, distanceKm, totalKm } = useMemo(() => {
    if (rawCoords.length === 0 || cumulative.length === 0) {
      return { youPosition: null, distanceKm: 0, totalKm: 0 };
    }
    const result = pointAlongRoute(rawCoords, cumulative, progress);
    return {
      youPosition: result.position as L.LatLngExpression,
      distanceKm: result.distanceKm,
      totalKm: result.totalKm,
    };
  }, [rawCoords, cumulative, progress]);

  if (error) {
    return <p className="p-4 text-sm text-terracotta">{error}</p>;
  }

  if (lineLatLngs.length === 0) {
    return <p className="p-4 text-sm text-muted">Loading map…</p>;
  }

  const start = lineLatLngs[0]!;
  const end = lineLatLngs[lineLatLngs.length - 1]!;

  return (
    <div>
      <div className="route-map-wrap">
        <MapContainer center={youPosition ?? start} zoom={5} scrollWheelZoom className="route-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline
            positions={lineLatLngs}
            pathOptions={{ color: '#9CB8A0', weight: 4, opacity: 0.9 }}
          />
          <CircleMarker
            center={start}
            radius={7}
            pathOptions={{ color: '#4A4543', fillColor: '#A8C5DA', fillOpacity: 1, weight: 2 }}
          />
          {youPosition && (
            <CircleMarker
              center={youPosition}
              radius={10}
              pathOptions={{ color: '#fff', fillColor: '#D4A574', fillOpacity: 1, weight: 3 }}
            />
          )}
          <CircleMarker
            center={end}
            radius={7}
            pathOptions={{ color: '#4A4543', fillColor: '#9CB8A0', fillOpacity: 1, weight: 2 }}
          />
          <FitBounds positions={lineLatLngs} />
        </MapContainer>
      </div>
      <div className="border-t border-blush/60 bg-canvas/80 px-4 py-3 text-sm">
        <p className="font-semibold text-ink">
          ~{Math.round(distanceKm).toLocaleString()} km into the journey
        </p>
        <p className="text-muted">
          {formatSteps(totalSteps)} steps ({(progress * 100).toFixed(1)}% of 6M) · Route ~{' '}
          {routeMeta?.distanceKm.toLocaleString() ?? Math.round(totalKm).toLocaleString()} km ·
          Cancún → Tijuana
        </p>
        <p className="mt-1 text-xs text-muted">
          Sky dot = start (Cancún) · Terracotta = you (estimate) · Sage = Tijuana
        </p>
      </div>
    </div>
  );
}
