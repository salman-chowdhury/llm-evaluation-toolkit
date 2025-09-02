import { useState, useEffect, useCallback } from 'react';
import type { TrafficData } from '../types';
import TrafficDataService from '../services/trafficService';

interface UseTrafficDataResult {
  data: TrafficData | null;
  isLoading: boolean;
  isDemo: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useTrafficData = (): UseTrafficDataResult => {
  const [data, setData] = useState<TrafficData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trafficService = TrafficDataService.getInstance();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await trafficService.fetchTrafficData();
      setData(result.data);
      setIsDemo(result.isDemo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load traffic data');
    } finally {
      setIsLoading(false);
    }
  }, [trafficService]);

  const refresh = useCallback(async () => {
    await trafficService.refreshData().then(result => {
      setData(result.data);
      setIsDemo(result.isDemo);
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to refresh traffic data');
    });
  }, [trafficService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isDemo,
    error,
    refresh,
  };
};