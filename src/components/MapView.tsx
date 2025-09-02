import React, { useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { Map } from 'leaflet';
import type { TrafficData, LayerSettings, SavedRoute, ReportIssue, Coordinates } from '../types';
import { BRISBANE_WESTERN_SUBURBS, DEFAULT_ZOOM, MAP_CONFIG } from '../utils/constants';
import { isEventInFuture } from '../utils/dateUtils';
import { useRouteInsights } from '../hooks/useRouteInsights';
import HotspotChips from './HotspotChips';
import IncidentMarker from './IncidentMarker';
import CameraMarker from './CameraMarker';
import Legend, { LegendButton } from './Legend';
import LayerToggles from './LayerToggles';
import SavedRoutes from './SavedRoutes';
import RouteInsights from './RouteInsights';
import { ReportButton, useReportModal } from './ReportModal';
import './MapView.css';

interface MapViewProps {
  className?: string;
  trafficData?: TrafficData | null;
  settings: LayerSettings;
  onSettingChange: <K extends keyof LayerSettings>(key: K, value: LayerSettings[K]) => void;
  routes: SavedRoute[];
  onAddRoute: (start: string, destination: string, name?: string) => SavedRoute;
  onRemoveRoute: (id: string) => void;
  onSubmitReport: (type: 'congestion' | 'safety' | 'road_condition', location: Coordinates, note?: string) => ReportIssue;
}

const MapView: React.FC<MapViewProps> = ({ 
  className, 
  trafficData, 
  settings, 
  onSettingChange, 
  routes, 
  onAddRoute, 
  onRemoveRoute,
  onSubmitReport 
}) => {
  const mapRef = useRef<Map>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Report modal
  const { openModal, Modal } = useReportModal(onSubmitReport);
  
  // Generate AI insights for routes
  const { insights, refreshInsights, isGenerating } = useRouteInsights(routes, trafficData);
  
  // Filter incidents based on settings
  const visibleIncidents = useMemo(() => {
    if (!trafficData?.incidents) return [];
    
    return trafficData.incidents.filter(incident => {
      // Hide future events if toggle is off
      if (!settings.showFutureEvents && isEventInFuture(incident.start)) {
        return false;
      }
      return true;
    });
  }, [trafficData?.incidents, settings.showFutureEvents]);
  
  // Filter cameras based on settings
  const visibleCameras = useMemo(() => {
    if (!trafficData?.cameras) return [];
    return settings.showCameras ? trafficData.cameras : [];
  }, [trafficData?.cameras, settings.showCameras]);
  
  const handleRouteClick = (route: SavedRoute) => {
    if (!mapRef.current) return;
    
    // If we have coordinates for both start and destination, fit bounds
    if (route.startCoords && route.destCoords) {
      const bounds = [
        [route.startCoords.lat, route.startCoords.lng],
        [route.destCoords.lat, route.destCoords.lng]
      ] as [[number, number], [number, number]];
      
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (route.startCoords) {
      // Just pan to start location
      mapRef.current.setView([route.startCoords.lat, route.startCoords.lng], 15);
    } else if (route.destCoords) {
      // Just pan to destination
      mapRef.current.setView([route.destCoords.lat, route.destCoords.lng], 15);
    }
  };

  const handleHotspotClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16, { animate: true });
    }
  };

  return (
    <div className={`map-view ${className || ''}`}>
      <MapContainer
        center={[BRISBANE_WESTERN_SUBURBS.lat, BRISBANE_WESTERN_SUBURBS.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        attributionControl={true}
        zoomControl={false}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution={MAP_CONFIG.attribution}
          maxZoom={MAP_CONFIG.maxZoom}
          minZoom={MAP_CONFIG.minZoom}
        />
        <ZoomControl position="topright" />
        
        {/* Render incident markers */}
        {visibleIncidents.map((incident) => (
          <IncidentMarker key={incident.id} incident={incident} />
        ))}
        
        {/* Render camera markers */}
        {visibleCameras.map((camera) => (
          <CameraMarker key={camera.id} camera={camera} />
        ))}
      </MapContainer>
      
      {!mapLoaded && (
        <div className="map-loading">
          <div className="map-loading-content">
            <div className="map-loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}      
      <HotspotChips onHotspotClick={handleHotspotClick} />
      <LayerToggles
        settings={settings}
        onSettingChange={onSettingChange}
        trafficAvailable={false}
      />
      <SavedRoutes
        routes={routes}
        onAddRoute={onAddRoute}
        onRemoveRoute={onRemoveRoute}
        onRouteClick={handleRouteClick}
      />
      <RouteInsights
        insights={insights}
        routes={routes}
        onRefresh={refreshInsights}
        isGenerating={isGenerating}
      />
      <ReportButton onClick={openModal} />
      <LegendButton onClick={() => setLegendOpen(true)} />
      <Legend isOpen={legendOpen} onClose={() => setLegendOpen(false)} />
      <Modal />
    </div>
  );
};

export default MapView;