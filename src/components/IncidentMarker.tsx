import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Incident } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import './IncidentMarker.css';

// Create custom icons
const createIcon = (color: string, type: 'incident' | 'roadworks' | 'closure') => {
  return L.divIcon({
    html: `
      <div class="custom-marker ${type}" style="background-color: ${color}">
        ${type === 'incident' ? '⚠️' : type === 'roadworks' ? '🚧' : '🚫'}
      </div>
    `,
    className: 'custom-marker-wrapper',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const getIncidentIcon = (incident: Incident) => {
  switch (incident.type) {
    case 'incident':
      return createIcon('#dc2626', 'incident');
    case 'roadworks':
      return createIcon('#d97706', 'roadworks');
    case 'closure':
      return createIcon('#6366f1', 'closure');
    default:
      return createIcon('#64748b', 'incident');
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <AlertTriangle size={16} className="status-icon active" />;
    case 'planned':
      return <Clock size={16} className="status-icon planned" />;
    case 'resolved':
      return <CheckCircle size={16} className="status-icon resolved" />;
    default:
      return <AlertTriangle size={16} className="status-icon" />;
  }
};

interface IncidentMarkerProps {
  incident: Incident;
}

const IncidentMarker: React.FC<IncidentMarkerProps> = ({ incident }) => {
  return (
    <Marker
      position={[incident.lat, incident.lng]}
      icon={getIncidentIcon(incident)}
    >
      <Popup className="incident-popup">
        <div className="incident-popup-content">
          <div className="incident-header">
            <h3 className="incident-title">{incident.title}</h3>
            <div className="incident-status">
              {getStatusIcon(incident.status)}
              <span className="status-text">{incident.status}</span>
            </div>
          </div>
          
          {incident.description && (
            <p className="incident-description">{incident.description}</p>
          )}
          
          <div className="incident-details">
            <div className="detail-item">
              <span className="detail-label">Started:</span>
              <span className="detail-value">
                {formatDateTime(incident.start)}
              </span>
            </div>
            
            {incident.end && (
              <div className="detail-item">
                <span className="detail-label">Expected end:</span>
                <span className="detail-value">
                  {formatDateTime(incident.end)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default IncidentMarker;