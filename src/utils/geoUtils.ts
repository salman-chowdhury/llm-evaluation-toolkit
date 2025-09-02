import type { Coordinates } from '../types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate  
 * @returns Distance in meters
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = coord1.lat * Math.PI/180; // φ, λ in radians
  const φ2 = coord2.lat * Math.PI/180;
  const Δφ = (coord2.lat-coord1.lat) * Math.PI/180;
  const Δλ = (coord2.lng-coord1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

/**
 * Check if a point is within a certain distance of a route
 * For simple routes (start/end only), check proximity to both points
 * @param point Point to check
 * @param routeStart Route start coordinate
 * @param routeEnd Route end coordinate  
 * @param threshold Distance threshold in meters
 * @returns True if point is within threshold of route
 */
export const isPointNearRoute = (
  point: Coordinates,
  routeStart: Coordinates,
  routeEnd: Coordinates,
  threshold: number
): boolean => {
  const distanceToStart = calculateDistance(point, routeStart);
  const distanceToEnd = calculateDistance(point, routeEnd);
  
  // Check if point is near either start or end
  return distanceToStart <= threshold || distanceToEnd <= threshold;
};

/**
 * Find the closest distance from a point to a route
 * @param point Point to check
 * @param routeStart Route start coordinate
 * @param routeEnd Route end coordinate
 * @returns Minimum distance in meters
 */
export const getMinDistanceToRoute = (
  point: Coordinates,
  routeStart: Coordinates,
  routeEnd: Coordinates
): number => {
  const distanceToStart = calculateDistance(point, routeStart);
  const distanceToEnd = calculateDistance(point, routeEnd);
  
  return Math.min(distanceToStart, distanceToEnd);
};

/**
 * Format distance for display
 * @param distance Distance in meters
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};