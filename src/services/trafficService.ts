import type { TrafficData } from '../types';

class TrafficDataService {
  private static instance: TrafficDataService;
  private cache: TrafficData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): TrafficDataService {
    if (!TrafficDataService.instance) {
      TrafficDataService.instance = new TrafficDataService();
    }
    return TrafficDataService.instance;
  }

  async fetchTrafficData(): Promise<{ data: TrafficData; isDemo: boolean }> {
    // Check if we have fresh cached data
    const now = Date.now();
    if (this.cache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return { data: this.cache, isDemo: false };
    }

    // Try to fetch from live API if configured
    const apiUrl = import.meta.env.VITE_TRAFFIC_API_URL;
    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.cache = data;
          this.cacheTimestamp = now;
          return { data, isDemo: false };
        }
      } catch (error) {
        console.warn('Failed to fetch live traffic data, falling back to demo data:', error);
      }
    }

    // Fallback to demo data
    return this.fetchDemoData();
  }

  private async fetchDemoData(): Promise<{ data: TrafficData; isDemo: boolean }> {
    try {
      const response = await fetch('/demo_incidents.json');
      if (!response.ok) {
        throw new Error('Failed to fetch demo data');
      }
      const data = await response.json();
      
      // Update timestamps to current time for demo purposes
      const now = new Date();
      const enhancedData: TrafficData = {
        ...data,
        generated_at: now.toISOString(),
        incidents: data.incidents.map((incident: any) => ({
          ...incident,
          // Adjust demo timestamps to be relative to current time
          start: incident.status === 'active' 
            ? new Date(now.getTime() - 30 * 60 * 1000).toISOString() // 30 min ago
            : incident.start, // Keep future times as-is
        })),
      };

      return { data: enhancedData, isDemo: true };
    } catch (error) {
      console.error('Failed to load demo data:', error);
      throw new Error('Unable to load traffic data');
    }
  }

  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }

  async refreshData(): Promise<{ data: TrafficData; isDemo: boolean }> {
    this.clearCache();
    return this.fetchTrafficData();
  }
}

export default TrafficDataService;