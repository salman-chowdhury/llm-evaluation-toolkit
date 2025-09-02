import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Car, Clock, Camera, AlertCircle } from 'lucide-react';
import type { LayerSettings } from '../types';
import './LayerToggles.css';

interface LayerTogglesProps {
  settings: LayerSettings;
  onSettingChange: <K extends keyof LayerSettings>(key: K, value: LayerSettings[K]) => void;
  trafficAvailable?: boolean;
}

const LayerToggles: React.FC<LayerTogglesProps> = ({ 
  settings, 
  onSettingChange, 
  trafficAvailable = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggles = [
    {
      key: 'showTraffic' as const,
      label: 'Traffic Layer',
      description: trafficAvailable ? 'Live traffic conditions' : 'Traffic data unavailable',
      icon: <Car size={16} />,
      enabled: settings.showTraffic,
      disabled: !trafficAvailable,
    },
    {
      key: 'showFutureEvents' as const,
      label: 'Future Events',
      description: 'Planned roadworks and closures',
      icon: <Clock size={16} />,
      enabled: settings.showFutureEvents,
      disabled: false,
    },
    {
      key: 'showCameras' as const,
      label: 'Traffic Cameras',
      description: 'Red light and speed cameras',
      icon: <Camera size={16} />,
      enabled: settings.showCameras,
      disabled: false,
    },
  ];

  return (
    <div className="layer-toggles">
      <button
        className="layer-toggles-header"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-controls="layer-toggles-content"
        aria-label="Layer toggles panel"
      >
        <div className="header-content">
          <Layers size={16} />
          <span>Layers</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div id="layer-toggles-content" className="layer-toggles-content">
          {toggles.map((toggle) => (
            <div key={toggle.key} className={`toggle-item ${toggle.disabled ? 'disabled' : ''}`}>
              <label className="toggle-label">
                <div className="toggle-info">
                  <div className="toggle-header">
                    {toggle.icon}
                    <span className="toggle-title">{toggle.label}</span>
                    {toggle.disabled && <AlertCircle size={12} className="warning-icon" />}
                  </div>
                  <span className="toggle-description">{toggle.description}</span>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={toggle.enabled && !toggle.disabled}
                    onChange={(e) => onSettingChange(toggle.key, e.target.checked)}
                    disabled={toggle.disabled}
                    aria-describedby={`${toggle.key}-desc`}
                  />
                  <span className="slider"></span>
                </div>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerToggles;