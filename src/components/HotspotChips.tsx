import React from 'react';
import { MapPin } from 'lucide-react';
import { HOTSPOTS } from '../utils/constants';
import './HotspotChips.css';

interface HotspotChipsProps {
  onHotspotClick: (lat: number, lng: number) => void;
}

const HotspotChips: React.FC<HotspotChipsProps> = ({ onHotspotClick }) => {
  return (
    <div className="hotspot-chips" role="navigation" aria-label="Quick navigation to key locations">
      <div className="hotspot-chips-header">
        <MapPin size={16} aria-hidden="true" />
        <span>Quick Navigation</span>
      </div>
      <div className="hotspot-chips-list" role="list">
        {HOTSPOTS.map((hotspot) => (
          <button
            key={hotspot.id}
            className="hotspot-chip"
            onClick={() => onHotspotClick(hotspot.coordinates.lat, hotspot.coordinates.lng)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onHotspotClick(hotspot.coordinates.lat, hotspot.coordinates.lng);
              }
            }}
            aria-label={`Navigate map to ${hotspot.name}`}
            role="listitem"
          >
            {hotspot.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HotspotChips;