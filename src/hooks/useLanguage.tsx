'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupportedLanguage } from '../utils/locale.util';
import { useSettings } from './useSettings';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'vi', // Default to Vietnamese since we're using Vietnamese UI
  setLanguage: () => { },
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps your app and makes language context available
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('vi');
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.defaultLanguage) {
      const next = settings.defaultLanguage as SupportedLanguage;
      if (next && next !== language) setLanguage(next);
    }
  }, [settings?.defaultLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook that lets any component use the language context
 */
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
