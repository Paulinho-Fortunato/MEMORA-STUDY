// Contexto global do aplicativo

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  getSettings, 
  updateSettings as updateSettingsDB, 
  getStatistics, 
  updateStatistics as updateStatisticsDB,
  exportAllData,
  importAllData,
} from '../storage/database';
import { UserSettings, Statistics, AppData } from '../types';

interface AppContextType {
  settings: UserSettings;
  statistics: Statistics;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateStatistics: (stats: Partial<Statistics>) => Promise<void>;
  refreshData: () => Promise<void>;
  exportData: () => Promise<AppData>;
  importData: (data: AppData) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'auto',
    accentColor: '#007AFF',
    fontSize: 'medium',
    sessionDuration: 25,
    breakDuration: 5,
    reviewIntervals: [1, 7, 15, 30],
    notificationsEnabled: true,
    studyHours: { start: 8, end: 22 },
    weekStart: 'monday',
    name: '',
    onboardingCompleted: false,
  });
  const [statistics, setStatistics] = useState<Statistics>({
    totalStudyTime: 0,
    sessionsCompleted: 0,
    topicsLearned: 0,
    reviewsCompleted: 0,
    streak: 0,
    lastStudyDate: null,
    weeklyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [loadedSettings, loadedStats] = await Promise.all([
        getSettings(),
        getStatistics(),
      ]);
      setSettings(loadedSettings);
      setStatistics(loadedStats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = await updateSettingsDB(newSettings);
    setSettings(updated);
  };

  const updateStatistics = async (newStats: Partial<Statistics>) => {
    const updated = await updateStatisticsDB(newStats);
    setStatistics(updated);
  };

  const refreshData = async () => {
    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  };

  const exportData = async (): Promise<AppData> => {
    return exportAllData();
  };

  const importData = async (data: AppData) => {
    await importAllData(data);
    await refreshData();
  };

  // Detectar tema do sistema
  useEffect(() => {
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };
      handleChange();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // Atualizar cor de destaque
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
  }, [settings.accentColor]);

  // Atualizar tamanho da fonte
  useEffect(() => {
    const fontSizes = {
      small: '14px',
      medium: '17px',
      large: '20px',
    };
    document.documentElement.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);
  }, [settings.fontSize]);

  const value: AppContextType = {
    settings,
    statistics,
    updateSettings,
    updateStatistics,
    refreshData,
    exportData,
    importData,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}
