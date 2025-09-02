import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Camera, Eye } from 'lucide-react';
import type { Camera as CameraType } from '../types';
import './CameraMarker.css';

// Create camera icon
const createCameraIcon = (type: 'red_light' | 'speed') => {
  const color = type === 'red_light' ? '#dc2626' : '#2563eb';
  
  return L.divIcon({
    html: `
      <div class="camera-marker ${type}" style="background-color: ${color}">
        📷
      </div>
    `,
    className: 'camera-marker-wrapper',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

interface CameraMarkerProps {
  camera: CameraType;
}

const CameraMarker: React.FC<CameraMarkerProps> = ({ camera }) => {
  return (
    <Marker
      position={[camera.lat, camera.lng]}
      icon={createCameraIcon(camera.type)}
    >
      <Popup className="camera-popup">
        <div className="camera-popup-content">
          <div className="camera-header">
            <Camera size={20} className="camera-icon" />
            <h3 className="camera-title">
              {camera.type === 'red_light' ? 'Red Light Camera' : 'Speed Camera'}
            </h3>
          </div>
          
          {camera.location && (
            <p className="camera-location">
              <Eye size={14} />
              {camera.location}
            </p>
          )}
          
          <div className="camera-details">
            <span className="camera-type-badge">
              {camera.type === 'red_light' ? 'Red Light' : 'Speed Enforcement'}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default CameraMarker;