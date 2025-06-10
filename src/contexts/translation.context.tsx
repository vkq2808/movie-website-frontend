'use client';
import React, { createContext, useContext, useState } from 'react';
import { SupportedLanguage } from '../utils/locale.util';
import translate, { TranslationKey } from '../utils/translation.util';

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

// Create context with default values
const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => { },
  t: (key) => key
});

interface TranslationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps your app and makes translation context available
 */
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  // Translation function that uses current language
  const t = (key: TranslationKey) => translate(key, language);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

/**
 * Hook that lets any component use the translation context
 */
export const useTranslation = () => useContext(TranslationContext);

export default TranslationContext;
