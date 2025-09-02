import React, { useState } from 'react';
import { Brain, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, Clock, CheckCircle, MapPin } from 'lucide-react';
import type { RouteInsight, RouteImpact } from '../services/insightsService';
import type { SavedRoute } from '../types';
import { formatDistance } from '../utils/geoUtils';
import './RouteInsights.css';

interface RouteInsightsProps {
  insights: RouteInsight[];
  routes: SavedRoute[];
  onRefresh: () => void;
  isGenerating: boolean;
  defaultExpanded?: boolean;
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'high': return 'var(--color-error)';
    case 'medium': return 'var(--color-warning)';
    case 'low': return 'var(--color-success)';
    default: return 'var(--color-text-muted)';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <AlertTriangle size={14} className="status-icon active" />;
    case 'planned':
      return <Clock size={14} className="status-icon planned" />;
    case 'resolved':
      return <CheckCircle size={14} className="status-icon resolved" />;
    default:
      return <AlertTriangle size={14} className="status-icon" />;
  }
};

const ImpactItem: React.FC<{ impact: RouteImpact }> = ({ impact }) => (
  <div className="impact-item">
    <div className="impact-header">
      {getStatusIcon(impact.status)}
      <span className="impact-title">{impact.title}</span>
      <span className="impact-distance">{formatDistance(impact.distance)}</span>
    </div>
    <div className="impact-details">
      <span className="impact-timeframe">{impact.timeframe}</span>
      <span className={`impact-severity ${impact.severity}`}>
        {impact.severity.toUpperCase()}
      </span>
    </div>
  </div>
);

const InsightCard: React.FC<{ insight: RouteInsight; route: SavedRoute | undefined }> = ({ 
  insight, 
  route 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!route) return null;

  return (
    <div className={`insight-card severity-${insight.severity}`}>
      <div className="insight-header">
        <div className="insight-info">
          <h3 className="insight-route-name">{route.name}</h3>
          <p className="insight-summary">{insight.summary}</p>
        </div>
        <div 
          className="insight-severity-indicator"
          style={{ backgroundColor: getSeverityColor(insight.severity) }}
        />
      </div>
      
      {insight.impacts.length > 0 && (
        <>
          <button
            className="insight-expand"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>View {insight.impacts.length} issue{insight.impacts.length !== 1 ? 's' : ''}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isExpanded && (
            <div className="insight-impacts">
              {insight.impacts.map((impact, index) => (
                <ImpactItem key={index} impact={impact} />
              ))}
            </div>
          )}
        </>
      )}
      
      <div className="insight-footer">
        <span className="insight-updated">
          Updated {new Date(insight.lastUpdated).toLocaleTimeString('en-AU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

const RouteInsights: React.FC<RouteInsightsProps> = ({
  insights,
  routes,
  onRefresh,
  isGenerating,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div className="route-insights">
      <button
        className="route-insights-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="route-insights-content"
      >
        <div className="header-content">
          <Brain size={16} />
          <span>AI Route Insights</span>
          {insights.length > 0 && (
            <span className="insights-count">({insights.length})</span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div id="route-insights-content" className="route-insights-content">
          <div className="insights-actions">
            <button
              className="refresh-button"
              onClick={onRefresh}
              disabled={isGenerating}
              aria-label="Refresh route insights"
            >
              <RefreshCw size={14} className={isGenerating ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
          
          {isGenerating && (
            <div className="insights-loading">
              <p>Analyzing routes...</p>
            </div>
          )}
          
          {!isGenerating && insights.length === 0 && routes.length === 0 && (
            <div className="insights-empty">
              <MapPin size={24} />
              <p>No saved routes</p>
              <span>Add routes to get AI-powered traffic insights</span>
            </div>
          )}
          
          {!isGenerating && insights.length === 0 && routes.length > 0 && (
            <div className="insights-empty">
              <Brain size={24} />
              <p>No insights available</p>
              <span>Routes need valid locations for AI analysis</span>
            </div>
          )}
          
          {!isGenerating && insights.length > 0 && (
            <div className="insights-list">
              {insights.map((insight) => {
                const route = routes.find(r => r.id === insight.routeId);
                return (
                  <InsightCard
                    key={insight.routeId}
                    insight={insight}
                    route={route}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteInsights;