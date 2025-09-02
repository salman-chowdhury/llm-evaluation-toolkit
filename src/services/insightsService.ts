import type { SavedRoute, Incident, TrafficData } from '../types';
import { isPointNearRoute, getMinDistanceToRoute, formatDistance } from '../utils/geoUtils';
import { isEventActive, isEventInFuture } from '../utils/dateUtils';
import { PROXIMITY_THRESHOLD, INSIGHT_TIME_WINDOW } from '../utils/constants';

export interface RouteInsight {
  routeId: string;
  summary: string;
  impacts: RouteImpact[];
  severity: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface RouteImpact {
  type: 'incident' | 'roadworks' | 'closure';
  title: string;
  distance: number;
  status: 'active' | 'planned' | 'resolved';
  timeframe: string;
  severity: 'low' | 'medium' | 'high';
}

class InsightsService {
  private static instance: InsightsService;

  public static getInstance(): InsightsService {
    if (!InsightsService.instance) {
      InsightsService.instance = new InsightsService();
    }
    return InsightsService.instance;
  }

  /**
   * Generate AI insights for a route based on current and future traffic data
   */
  generateRouteInsight(route: SavedRoute, trafficData: TrafficData): RouteInsight | null {
    if (!route.startCoords || !route.destCoords) {
      return null;
    }

    const now = new Date();
    const timeWindowEnd = new Date(now.getTime() + INSIGHT_TIME_WINDOW * 60 * 60 * 1000);
    
    // Find relevant incidents within proximity and time window
    const relevantIncidents = trafficData.incidents.filter(incident => {
      // Check if incident is within proximity
      const isNear = isPointNearRoute(
        { lat: incident.lat, lng: incident.lng },
        route.startCoords!,
        route.destCoords!,
        PROXIMITY_THRESHOLD
      );

      if (!isNear) return false;

      // Check if incident is currently active or will be active within time window
      const incidentStart = new Date(incident.start);
      const incidentEnd = incident.end ? new Date(incident.end) : null;

      // Active now or starting within time window
      const isCurrentlyActive = isEventActive(incident.start, incident.end);
      const willBeActive = incidentStart <= timeWindowEnd;
      const stillActive = !incidentEnd || incidentEnd >= now;

      return (isCurrentlyActive || willBeActive) && stillActive;
    });

    if (relevantIncidents.length === 0) {
      return {
        routeId: route.id,
        summary: 'Clear route - no known issues affecting your journey.',
        impacts: [],
        severity: 'low',
        lastUpdated: now.toISOString(),
      };
    }

    // Convert incidents to impacts
    const impacts: RouteImpact[] = relevantIncidents.map(incident => {
      const distance = getMinDistanceToRoute(
        { lat: incident.lat, lng: incident.lng },
        route.startCoords!,
        route.destCoords!
      );

      return {
        type: incident.type,
        title: incident.title,
        distance,
        status: incident.status,
        timeframe: this.getTimeframe(incident.start, incident.end),
        severity: this.calculateIncidentSeverity(incident, distance),
      };
    });

    // Calculate overall severity
    const overallSeverity = this.calculateOverallSeverity(impacts);
    
    // Generate summary
    const summary = this.generateSummary(impacts, overallSeverity);

    return {
      routeId: route.id,
      summary,
      impacts,
      severity: overallSeverity,
      lastUpdated: now.toISOString(),
    };
  }

  private getTimeframe(start: string, end?: string): string {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    if (isEventActive(start, end)) {
      if (endDate) {
        const hoursRemaining = Math.round((endDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        return `Active (${hoursRemaining}h remaining)`;
      }
      return 'Active now';
    }

    if (isEventInFuture(start)) {
      const hoursUntil = Math.round((startDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      if (hoursUntil < 1) {
        const minutesUntil = Math.round((startDate.getTime() - now.getTime()) / (1000 * 60));
        return `Starting in ${minutesUntil}min`;
      }
      return `Starting in ${hoursUntil}h`;
    }

    return 'Recently cleared';
  }

  private calculateIncidentSeverity(incident: Incident, distance: number): 'low' | 'medium' | 'high' {
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    // Base severity on incident type
    if (incident.type === 'closure') {
      severity = 'high';
    } else if (incident.type === 'roadworks') {
      severity = 'medium';
    } else {
      severity = 'low';
    }

    // Increase severity for closer incidents
    if (distance < 100) {
      severity = severity === 'low' ? 'medium' : 'high';
    }

    // Increase severity for active incidents
    if (incident.status === 'active') {
      severity = severity === 'low' ? 'medium' : 'high';
    }

    return severity;
  }

  private calculateOverallSeverity(impacts: RouteImpact[]): 'low' | 'medium' | 'high' {
    if (impacts.length === 0) return 'low';
    
    const severityScores = impacts.map(impact => {
      switch (impact.severity) {
        case 'high': return 3;
        case 'medium': return 2;
        case 'low': return 1;
        default: return 1;
      }
    });

    const maxScore = Math.max(...severityScores);
    const avgScore = severityScores.reduce((a, b) => a + b, 0) / severityScores.length;

    if (maxScore >= 3 || avgScore >= 2.5) return 'high';
    if (maxScore >= 2 || avgScore >= 1.5) return 'medium';
    return 'low';
  }

  private generateSummary(impacts: RouteImpact[], severity: 'low' | 'medium' | 'high'): string {
    if (impacts.length === 0) {
      return 'Clear route - no known issues affecting your journey.';
    }

    const activeImpacts = impacts.filter(impact => impact.status === 'active');
    const plannedImpacts = impacts.filter(impact => impact.status === 'planned');
    
    if (severity === 'high') {
      if (activeImpacts.length > 0) {
        return `⚠️ Major disruption: ${activeImpacts[0].title}. Consider alternative route.`;
      }
      if (plannedImpacts.length > 0) {
        return `🚧 Major roadworks planned: ${plannedImpacts[0].title}. Plan extra time.`;
      }
    }

    if (severity === 'medium') {
      if (activeImpacts.length > 0) {
        return `⚠️ Minor delays expected from ${activeImpacts[0].title}.`;
      }
      if (plannedImpacts.length > 0) {
        return `🚧 Roadworks starting soon: ${plannedImpacts[0].title}.`;
      }
    }

    if (impacts.length === 1) {
      const impact = impacts[0];
      const distance = formatDistance(impact.distance);
      return `ℹ️ ${impact.title} (${distance} from route).`;
    }

    return `ℹ️ ${impacts.length} issues near your route. Check details below.`;
  }
}

export default InsightsService;