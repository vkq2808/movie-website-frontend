'use client';
import React, { createContext, useContext, useState } from 'react';
import { SupportedLanguage } from '../utils/locale.util';

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
