import type { Coordinates, Hotspot } from '../types';

// Western suburbs center point
export const BRISBANE_WESTERN_SUBURBS: Coordinates = {
  lat: -27.49,
  lng: 152.98
};

export const DEFAULT_ZOOM = 13;
export const HOTSPOT_ZOOM = 16;

// Hotspot locations for quick navigation
export const HOTSPOTS: Hotspot[] = [
  {
    id: 'moggill-coonan',
    name: 'Moggill Rd / Coonan St',
    coordinates: { lat: -27.4936, lng: 152.9766 }
  },
  {
    id: 'toowong-roundabout',
    name: 'Toowong Roundabout',
    coordinates: { lat: -27.4857, lng: 152.9921 }
  },
  {
    id: 'indooroopilly-roundabout',
    name: 'Indooroopilly Roundabout',
    coordinates: { lat: -27.5045, lng: 152.9750 }
  }
];

// Map tile configuration
export const MAP_CONFIG = {
  tileUrl: import.meta.env.VITE_MAP_TILES_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 10
};

// Proximity threshold for AI insights (meters)
export const PROXIMITY_THRESHOLD = 500;

// Time window for AI insights (hours)
export const INSIGHT_TIME_WINDOW = 2;