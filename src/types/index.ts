export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: 'incident' | 'roadworks' | 'closure';
  title: string;
  status: 'active' | 'planned' | 'resolved';
  start: string;
  end?: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface Camera {
  id: string;
  type: 'red_light' | 'speed';
  lat: number;
  lng: number;
  location?: string;
}

export interface TrafficData {
  generated_at: string;
  incidents: Incident[];
  cameras: Camera[];
}

export interface Hotspot {
  id: string;
  name: string;
  coordinates: Coordinates;
}

export interface SavedRoute {
  id: string;
  name: string;
  start: string;
  destination: string;
  startCoords?: Coordinates;
  destCoords?: Coordinates;
  polyline?: [number, number][];
  createdAt: string;
}

export interface LayerSettings {
  showTraffic: boolean;
  showFutureEvents: boolean;
  showCameras: boolean;
}

export interface ReportIssue {
  id: string;
  type: 'congestion' | 'safety' | 'road_condition';
  location: Coordinates;
  note?: string;
  timestamp: string;
  status: 'submitted' | 'acknowledged' | 'resolved';
}