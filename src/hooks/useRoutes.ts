import { useState, useEffect, useCallback } from 'react';
import type { SavedRoute, Coordinates } from '../types';

const ROUTES_STORAGE_KEY = 'bris-traffic-nav-routes';

// Simple geocoding fallback for demo purposes (Brisbane western suburbs)
const LOCATION_SUGGESTIONS: Record<string, Coordinates> = {
  'toowong': { lat: -27.4857, lng: 152.9921 },
  'indooroopilly': { lat: -27.5045, lng: 152.9750 },
  'st lucia': { lat: -27.4988, lng: 153.0142 },
  'taringa': { lat: -27.4875, lng: 152.9859 },
  'kenmore': { lat: -27.5069, lng: 152.9394 },
  'chapel hill': { lat: -27.5044, lng: 152.9411 },
  'moggill': { lat: -27.5415, lng: 152.8766 },
  'fig tree pocket': { lat: -27.5250, lng: 152.9539 },
};

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const findLocationCoords = (locationName: string): Coordinates | null => {
  const normalized = locationName.toLowerCase().trim();
  
  // Check direct matches
  if (LOCATION_SUGGESTIONS[normalized]) {
    return LOCATION_SUGGESTIONS[normalized];
  }
  
  // Check partial matches
  for (const [key, coords] of Object.entries(LOCATION_SUGGESTIONS)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return coords;
    }
  }
  
  return null;
};

export const useRoutes = () => {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load routes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ROUTES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedRoute[];
        setRoutes(parsed);
      }
    } catch (error) {
      console.warn('Failed to load routes from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save routes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && routes.length >= 0) {
      try {
        localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
      } catch (error) {
        console.warn('Failed to save routes to localStorage:', error);
      }
    }
  }, [routes, isLoaded]);

  const addRoute = useCallback((start: string, destination: string, name?: string) => {
    const startCoords = findLocationCoords(start);
    const destCoords = findLocationCoords(destination);
    
    const route: SavedRoute = {
      id: generateId(),
      name: name || `${start} to ${destination}`,
      start,
      destination,
      startCoords: startCoords || undefined,
      destCoords: destCoords || undefined,
      createdAt: new Date().toISOString(),
    };

    setRoutes(prev => [...prev, route]);
    return route;
  }, []);

  const removeRoute = useCallback((id: string) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  }, []);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
  }, []);

  return {
    routes,
    addRoute,
    removeRoute,
    clearRoutes,
    isLoaded,
  };
};