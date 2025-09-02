import React, { useState } from 'react';
import { Flag, X, MapPin, Navigation2, Check } from 'lucide-react';
import type { ReportIssue, Coordinates } from '../types';
import './ReportModal.css';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (type: 'congestion' | 'safety' | 'road_condition', location: Coordinates, note?: string) => ReportIssue;
}

export const ReportButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button className="report-button" onClick={onClick}>
      <Flag size={16} />
      <span>Report Issue</span>
    </button>
  );
};

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmitReport }) => {
  const [type, setType] = useState<'congestion' | 'safety' | 'road_condition' | ''>('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const handleUseMapCenter = () => {
    setLocation({ lat: -27.49, lng: 152.98 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !location) return;

    onSubmitReport(type as any, location, note || undefined);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setType('');
      setNote('');
      setLocation(null);
      onClose();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="modal-overlay">
        <div className="modal-content success">
          <Check size={48} />
          <h3>Report Submitted!</h3>
          <p>Thank you for helping improve traffic conditions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Flag size={20} /> Report Issue</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Issue Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} required>
              <option value="">Select issue type</option>
              <option value="congestion">Traffic Congestion</option>
              <option value="safety">Safety Hazard</option>
              <option value="road_condition">Road Condition</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <div className="location-buttons">
              <button type="button" onClick={handleUseLocation}>
                <Navigation2 size={16} /> Current Location
              </button>
              <button type="button" onClick={handleUseMapCenter}>
                <MapPin size={16} /> Map Center
              </button>
            </div>
            {location && (
              <div className="location-display">
                Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Additional Details (Optional)</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
            />
          </div>

          <button type="submit" disabled={!type || !location}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export const useReportModal = (onSubmitReport: ReportModalProps['onSubmitReport']) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  const Modal = () => (
    <ReportModal isOpen={isOpen} onClose={closeModal} onSubmitReport={onSubmitReport} />
  );
  
  return { openModal, closeModal, Modal, isOpen };
};

export default ReportModal;