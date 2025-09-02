import React, { useEffect, useRef } from 'react';
import { Info, X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import './Legend.css';

interface LegendProps {
  isOpen: boolean;
  onClose: () => void;
}

const Legend: React.FC<LegendProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="legend-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="legend-title">
      <div className="legend-modal" onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1}>
        <div className="legend-header">
          <h2 id="legend-title">Map Legend</h2>
          <button 
            className="legend-close"
            onClick={onClose}
            aria-label="Close legend"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        
        <div className="legend-content">
          <div className="legend-section">
            <h3>Incidents & Roadworks</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-marker incident">⚠️</div>
                <div className="legend-text">
                  <strong>Traffic Incidents</strong>
                  <span>Crashes, breakdowns, hazards</span>
                </div>
              </div>
              
              <div className="legend-item">
                <div className="legend-marker roadworks">🚧</div>
                <div className="legend-text">
                  <strong>Roadworks</strong>
                  <span>Construction, maintenance</span>
                </div>
              </div>
              
              <div className="legend-item">
                <div className="legend-marker closure">🚫</div>
                <div className="legend-text">
                  <strong>Road Closures</strong>
                  <span>Planned closures, events</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="legend-section">
            <h3>Status Indicators</h3>
            <div className="legend-items">
              <div className="legend-item">
                <AlertTriangle size={16} className="status-icon active" />
                <div className="legend-text">
                  <strong>Active</strong>
                  <span>Currently happening</span>
                </div>
              </div>
              
              <div className="legend-item">
                <Clock size={16} className="status-icon planned" />
                <div className="legend-text">
                  <strong>Planned</strong>
                  <span>Scheduled for future</span>
                </div>
              </div>
              
              <div className="legend-item">
                <CheckCircle size={16} className="status-icon resolved" />
                <div className="legend-text">
                  <strong>Resolved</strong>
                  <span>Recently cleared</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="legend-section">
            <h3>Traffic Cameras</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-camera red-light">📷</div>
                <div className="legend-text">
                  <strong>Red Light Camera</strong>
                  <span>Intersection monitoring</span>
                </div>
              </div>
              
              <div className="legend-item">
                <div className="legend-camera speed">📷</div>
                <div className="legend-text">
                  <strong>Speed Camera</strong>
                  <span>Speed enforcement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LegendButtonProps {
  onClick: () => void;
}

export const LegendButton: React.FC<LegendButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="legend-button"
      onClick={onClick}
      aria-label="Open map legend"
    >
      <Info size={16} />
      <span>Legend</span>
    </button>
  );
};

export default Legend;