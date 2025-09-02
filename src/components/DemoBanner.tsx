import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import './DemoBanner.css';

interface DemoBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ isVisible, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <AlertCircle size={16} className="demo-banner-icon" />
        <span className="demo-banner-text">
          Demo data loaded - Live traffic data unavailable
        </span>
        <button
          className="demo-banner-close"
          onClick={onDismiss}
          aria-label="Dismiss demo banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;