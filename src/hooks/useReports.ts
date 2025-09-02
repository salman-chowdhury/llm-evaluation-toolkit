import { useState, useEffect, useCallback } from 'react';
import type { ReportIssue, Coordinates } from '../types';

const REPORTS_STORAGE_KEY = 'bris-traffic-nav-reports';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export const useReports = () => {
  const [reports, setReports] = useState<ReportIssue[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reports from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ReportIssue[];
        setReports(parsed);
      }
    } catch (error) {
      console.warn('Failed to load reports from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && reports.length >= 0) {
      try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
      } catch (error) {
        console.warn('Failed to save reports to localStorage:', error);
      }
    }
  }, [reports, isLoaded]);

  const submitReport = useCallback((
    type: 'congestion' | 'safety' | 'road_condition',
    location: Coordinates,
    note?: string
  ) => {
    const report: ReportIssue = {
      id: generateId(),
      type,
      location,
      note,
      timestamp: new Date().toISOString(),
      status: 'submitted',
    };

    setReports(prev => [report, ...prev]);
    return report;
  }, []);

  const clearReports = useCallback(() => {
    setReports([]);
  }, []);

  const removeReport = useCallback((id: string) => {
    setReports(prev => prev.filter(report => report.id !== id));
  }, []);

  return {
    reports,
    submitReport,
    clearReports,
    removeReport,
    isLoaded,
  };
};