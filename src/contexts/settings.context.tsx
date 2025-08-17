'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api.util';

export type PublicSettings = {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultLanguage: string;
  enableAnalytics: boolean;
};

type SettingsContextType = {
  settings: PublicSettings | null;
  refresh: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({ settings: null, refresh: async () => { } });

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await api.get<{ success: boolean; data: PublicSettings }>(`/settings`);
      if (res.data?.success) setSettings(res.data.data);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // Update document title and any global side-effects
  useEffect(() => {
    if (settings?.siteName) {
      document.title = settings.siteName;
    }
  }, [settings?.siteName]);

  return (
    <SettingsContext.Provider value={{ settings, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
