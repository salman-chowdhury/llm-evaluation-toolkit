import { useState, useEffect, useCallback } from 'react';
import type { LayerSettings } from '../types';

const DEFAULT_SETTINGS: LayerSettings = {
  showTraffic: true,
  showFutureEvents: true, 
  showCameras: true,
};

const STORAGE_KEY = 'bris-traffic-nav-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<LayerSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LayerSettings;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save settings to localStorage:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSetting = useCallback(<K extends keyof LayerSettings>(
    key: K, 
    value: LayerSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
  };
};