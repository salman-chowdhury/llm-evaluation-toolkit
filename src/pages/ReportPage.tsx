import { useState } from 'react';
import { Flag, Navigation2, MapPin, Check, AlertTriangle } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { useNavigate } from 'react-router-dom';
import type { Coordinates } from '../types';

const ReportPage = () => {
  const { submitReport } = useReports();
  const navigate = useNavigate();
  const [type, setType] = useState<'congestion' | 'safety' | 'road_condition' | ''>('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleUseLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Please try using map center.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleUseMapCenter = () => {
    setLocationError('');
    setLocation({ lat: -27.49, lng: 152.98 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !location) return;

    submitReport(type as any, location, note || undefined);
    setIsSubmitted(true);
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="page">
        <div className="page-content">
          <div className="success-message">
            <Check size={64} className="success-icon" />
            <h2>Report Submitted!</h2>
            <p>Thank you for helping improve traffic conditions.</p>
            <p className="redirect-notice">Returning to map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1><Flag size={24} /> Report Issue</h1>
        <p>Help improve traffic conditions by reporting issues</p>
      </div>
      <div className="page-content">
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="section-label">Issue Type *</label>
            <div className="issue-types">
              <label className={`issue-type ${type === 'congestion' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="congestion"
                  checked={type === 'congestion'}
                  onChange={(e) => setType(e.target.value as any)}
                />
                <div className="issue-content">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Traffic Congestion</strong>
                    <span>Heavy traffic, accidents, blockages</span>
                  </div>
                </div>
              </label>
              
              <label className={`issue-type ${type === 'safety' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="safety"
                  checked={type === 'safety'}
                  onChange={(e) => setType(e.target.value as any)}
                />
                <div className="issue-content">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Safety Hazard</strong>
                    <span>Dangerous conditions, obstacles</span>
                  </div>
                </div>
              </label>
              
              <label className={`issue-type ${type === 'road_condition' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="road_condition"
                  checked={type === 'road_condition'}
                  onChange={(e) => setType(e.target.value as any)}
                />
                <div className="issue-content">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Road Condition</strong>
                    <span>Potholes, damaged roads, flooding</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">Location *</label>
            <div className="location-buttons">
              <button type="button" className="location-button primary" onClick={handleUseLocation}>
                <Navigation2 size={16} />
                Current Location
              </button>
              <button type="button" className="location-button secondary" onClick={handleUseMapCenter}>
                <MapPin size={16} />
                Map Center
              </button>
            </div>
            {locationError && (
              <div className="location-error">
                {locationError}
              </div>
            )}
            {location && (
              <div className="location-display">
                <MapPin size={16} />
                Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="form-section">
            <label className="section-label">Additional Details</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the issue in more detail (optional)..."
              rows={4}
              maxLength={500}
            />
            <div className="form-hint">{note.length}/500</div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={!type || !location}
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;