import React from 'react';
import { Route, Navigation } from 'lucide-react';
import type { SavedRoute } from '../types';
import './RouteChips.css';

interface RouteChipsProps {
  routes: SavedRoute[];
  onRouteClick: (route: SavedRoute) => void;
}

const RouteChips: React.FC<RouteChipsProps> = ({ routes, onRouteClick }) => {
  // Only show routes that have valid coordinates
  const validRoutes = routes.filter(route => route.startCoords && route.destCoords);

  if (validRoutes.length === 0) {
    return null;
  }

  return (
    <div className="route-chips" role="navigation" aria-label="Saved routes quick access">
      <div className="route-chips-header">
        <Route size={16} aria-hidden="true" />
        <span>My Routes</span>
      </div>
      <div className="route-chips-list" role="list">
        {validRoutes.slice(0, 3).map((route) => (
          <button
            key={route.id}
            className="route-chip"
            onClick={() => onRouteClick(route)}
            aria-label={`Navigate to ${route.name}`}
            role="listitem"
          >
            <div className="route-chip-content">
              <span className="route-chip-name">{route.name}</span>
              <span className="route-chip-path">
                {route.start} → {route.destination}
              </span>
            </div>
            <Navigation size={12} aria-hidden="true" />
          </button>
        ))}
        {routes.length > 3 && (
          <div className="route-chips-more">
            +{routes.length - 3} more routes
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteChips;