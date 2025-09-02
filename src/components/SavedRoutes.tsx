import React, { useState } from 'react';
import { Route, Plus, X, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import type { SavedRoute } from '../types';
import './SavedRoutes.css';

interface SavedRoutesProps {
  routes: SavedRoute[];
  onAddRoute: (start: string, destination: string, name?: string) => SavedRoute;
  onRemoveRoute: (id: string) => void;
  onRouteClick?: (route: SavedRoute) => void;
  defaultExpanded?: boolean;
}

interface AddRouteFormProps {
  onSubmit: (start: string, destination: string, name?: string) => void;
  onCancel: () => void;
}

const AddRouteForm: React.FC<AddRouteFormProps> = ({ onSubmit, onCancel }) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start.trim() && destination.trim()) {
      onSubmit(start.trim(), destination.trim(), name.trim() || undefined);
      setStart('');
      setDestination('');
      setName('');
    }
  };

  return (
    <form className="add-route-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="route-start">From</label>
        <input
          id="route-start"
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="e.g., Toowong"
          required
        />
      </div>
      
      <div className="form-field">
        <label htmlFor="route-destination">To</label>
        <input
          id="route-destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Indooroopilly"
          required
        />
      </div>
      
      <div className="form-field">
        <label htmlFor="route-name">Name (optional)</label>
        <input
          id="route-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Work Commute"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Route
        </button>
      </div>
    </form>
  );
};

const SavedRoutes: React.FC<SavedRoutesProps> = ({
  routes,
  onAddRoute,
  onRemoveRoute,
  onRouteClick,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddRoute = (start: string, destination: string, name?: string) => {
    onAddRoute(start, destination, name);
    setShowAddForm(false);
  };

  const handleRouteClick = (route: SavedRoute) => {
    if (onRouteClick) {
      onRouteClick(route);
    }
  };

  return (
    <div className="saved-routes">
      <button
        className="saved-routes-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="saved-routes-content"
      >
        <div className="header-content">
          <Route size={16} />
          <span>My Routes</span>
          <span className="routes-count">({routes.length})</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div id="saved-routes-content" className="saved-routes-content">
          {routes.length === 0 && !showAddForm && (
            <div className="empty-state">
              <p>No saved routes yet</p>
              <button 
                className="btn-primary btn-small"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={14} />
                Add First Route
              </button>
            </div>
          )}
          
          {routes.length > 0 && (
            <div className="routes-list">
              {routes.map((route) => (
                <div key={route.id} className="route-item">
                  <button
                    className="route-button"
                    onClick={() => handleRouteClick(route)}
                    aria-label={`Navigate to ${route.name}`}
                  >
                    <div className="route-info">
                      <div className="route-name">{route.name}</div>
                      <div className="route-description">
                        {route.start} → {route.destination}
                      </div>
                      {(!route.startCoords || !route.destCoords) && (
                        <div className="route-warning">
                          Location not found
                        </div>
                      )}
                    </div>
                    <Navigation size={14} className="route-icon" />
                  </button>
                  
                  <button
                    className="route-delete"
                    onClick={() => onRemoveRoute(route.id)}
                    aria-label={`Delete ${route.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {!showAddForm && routes.length > 0 && (
            <button 
              className="add-route-button"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              Add Route
            </button>
          )}
          
          {showAddForm && (
            <AddRouteForm
              onSubmit={handleAddRoute}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SavedRoutes;