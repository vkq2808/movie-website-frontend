import { useEffect, useState } from 'react';
import { SupportedLanguage } from '../utils/locale.util';

/**
 * Custom hook to detect browser language and check if it's supported
 * @returns The detected supported language or fallback to 'en'
 */
export const useDetectLanguage = (): SupportedLanguage => {
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      // Get browser language (e.g., 'en-US', 'fr', 'ja-JP')
      const browserLang = navigator.language;

      // Extract the language part (before the dash if present)
      const langCode = browserLang.split('-')[0];

      // Check if this is a supported language
      const isSupported = ['en', 'zh', 'hi', 'es', 'ar', 'bn', 'fr', 'ru', 'pt',
        'ur', 'id', 'de', 'ja', 'mr', 'te', 'tr', 'ta', 'yue',
        'ko', 'vi'].includes(langCode);

      // Set detected language or fallback to English
      if (isSupported) {
        setDetectedLanguage(langCode as SupportedLanguage);
      }
    } catch (error) {
      console.error('Error detecting browser language:', error);
    }
  }, []);

  return detectedLanguage;
};

/**
 * Custom hook to manage language preference with persistence
 * @param initialLanguage Default language to use
 * @returns Language state and setter
 */
export const useLanguagePreference = (
  initialLanguage: SupportedLanguage = 'en'
): [SupportedLanguage, (lang: SupportedLanguage) => void] => {
  // Try to get language from localStorage, use initialLanguage as fallback
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window === 'undefined') return initialLanguage;

    try {
      const storedLang = localStorage.getItem('language');
      return storedLang ? (storedLang as SupportedLanguage) : initialLanguage;
    } catch (error) {
      console.error('Failed to retrieve language preference from localStorage:', error);
      return initialLanguage;
    }
  });

  // Custom setter that also updates localStorage
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang);
      } catch (error) {
        console.error('Failed to store language preference:', error);
      }
    }
  };

  return [language, setLanguage];
};

const languageHooks = { useDetectLanguage, useLanguagePreference };

export default languageHooks;