#!/usr/bin/env node
/**
 * Fetches an estimated foot route Cancún → Tijuana via OSRM (open data).
 * Run: node scripts/fetch-route.mjs
 */

import { writeFileSync } from 'node:fs';

const WAYPOINTS = [
  { name: 'Cancún', lng: -86.8515, lat: 21.1619 },
  { name: 'Mérida', lng: -89.5926, lat: 20.9674 },
  { name: 'Campeche', lng: -90.5349, lat: 19.8301 },
  { name: 'Villahermosa', lng: -92.9475, lat: 17.9892 },
  { name: 'Oaxaca', lng: -96.7266, lat: 17.0732 },
  { name: 'Ciudad de México', lng: -99.1332, lat: 19.4326 },
  { name: 'Guadalajara', lng: -103.3496, lat: 20.6597 },
  { name: 'Mazatlán', lng: -106.4069, lat: 23.2494 },
  { name: 'Hermosillo', lng: -110.9559, lat: 29.0729 },
  { name: 'Tijuana', lng: -117.0382, lat: 32.5149 },
];

const coords = WAYPOINTS.map((w) => `${w.lng},${w.lat}`).join(';');
const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;

const res = await fetch(url);
const data = await res.json();

if (data.code !== 'Ok' || !data.routes?.[0]) {
  console.error('OSRM failed:', data);
  process.exit(1);
}

const route = data.routes[0];
const allCoords = route.geometry.coordinates;

/** Keep at most ~800 points for a light GeoJSON */
function simplify(coords, maxPoints) {
  if (coords.length <= maxPoints) return coords;
  const step = (coords.length - 1) / (maxPoints - 1);
  const out = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(coords[Math.round(i * step)]);
  }
  return out;
}

const simplified = simplify(allCoords, 800);
const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
const durationHours = Math.round((route.duration / 3600) * 10) / 10;

const geojson = {
  type: 'FeatureCollection',
  metadata: {
    source: 'OSRM foot routing via public router.project-osrm.org',
    waypoints: WAYPOINTS,
    direction: 'Cancún → Tijuana',
    distanceKm,
    durationHours,
    fetchedAt: new Date().toISOString(),
    note: 'Estimated walking path along roads/trails. For inspiration only.',
  },
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Cancún to Tijuana walk (estimate)',
        distanceKm,
      },
      geometry: {
        type: 'LineString',
        coordinates: simplified,
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Start', role: 'start' },
      geometry: {
        type: 'Point',
        coordinates: simplified[0],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'End', role: 'end' },
      geometry: {
        type: 'Point',
        coordinates: simplified[simplified.length - 1],
      },
    },
  ],
};

const outPath = new URL('../public/mexico-walk-route.geojson', import.meta.url);
writeFileSync(outPath, JSON.stringify(geojson, null, 2));

console.log(`Route saved: ${outPath.pathname}`);
console.log(`Distance: ${distanceKm} km (~${durationHours} h foot estimate)`);
console.log(`Points: ${allCoords.length} → simplified to ${simplified.length}`);
