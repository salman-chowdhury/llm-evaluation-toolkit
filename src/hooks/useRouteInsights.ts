import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SavedRoute, TrafficData } from '../types';
import InsightsService, { type RouteInsight } from '../services/insightsService';

interface UseRouteInsightsResult {
  insights: RouteInsight[];
  refreshInsights: () => void;
  isGenerating: boolean;
}

export const useRouteInsights = (
  routes: SavedRoute[],
  trafficData: TrafficData | null | undefined
): UseRouteInsightsResult => {
  const [insights, setInsights] = useState<RouteInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const insightsService = useMemo(() => InsightsService.getInstance(), []);
  
  const generateInsights = useCallback(() => {
    if (!trafficData || routes.length === 0) {
      setInsights([]);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const newInsights: RouteInsight[] = [];
      
      for (const route of routes) {
        const insight = insightsService.generateRouteInsight(route, trafficData);
        if (insight) {
          newInsights.push(insight);
        }
      }
      
      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate route insights:', error);
      setInsights([]);
    } finally {
      setIsGenerating(false);
    }
  }, [routes, trafficData, insightsService]);
  
  // Auto-generate insights when routes or traffic data changes
  useEffect(() => {
    generateInsights();
  }, [generateInsights]);
  
  return {
    insights,
    refreshInsights: generateInsights,
    isGenerating,
  };
};