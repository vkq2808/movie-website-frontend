/**
 * Index file for all translation modules
 * Provides easy importing of all language translations
 */

// Import all language translations
import enTranslations from './en';
import zhTranslations from './zh';
import viTranslations from './vi';
import hiTranslations from './hi';
import esTranslations from './es';
import arTranslations from './ar';
import bnTranslations from './bn';
import frTranslations from './fr';
import ruTranslations from './ru';
import ptTranslations from './pt';
import urTranslations from './ur';
import idTranslations from './id';
import deTranslations from './de';
import jaTranslations from './ja';
import mrTranslations from './mr';
import teTranslations from './te';
import trTranslations from './tr';
import taTranslations from './ta';
import yueTranslations from './yue';
import koTranslations from './ko';

// Export all translations as a single object
export const allTranslations = {
  en: enTranslations,
  zh: zhTranslations,
  vi: viTranslations,
  hi: hiTranslations,
  es: esTranslations,
  ar: arTranslations,
  bn: bnTranslations,
  fr: frTranslations,
  ru: ruTranslations,
  pt: ptTranslations,
  ur: urTranslations,
  id: idTranslations,
  de: deTranslations,
  ja: jaTranslations,
  mr: mrTranslations,
  te: teTranslations,
  tr: trTranslations,
  ta: taTranslations,
  yue: yueTranslations,
  ko: koTranslations,
};

// Export individual translations for specific imports
export {
  enTranslations,
  zhTranslations,
  viTranslations,
  hiTranslations,
  esTranslations,
  arTranslations,
  bnTranslations,
  frTranslations,
  ruTranslations,
  ptTranslations,
  urTranslations,
  idTranslations,
  deTranslations,
  jaTranslations,
  mrTranslations,
  teTranslations,
  trTranslations,
  taTranslations,
  yueTranslations,
  koTranslations,
};

// Export supported language codes
export const supportedLanguages = [
  'en', 'zh', 'vi', 'hi', 'es', 'ar', 'bn', 'fr', 'ru', 'pt',
  'ur', 'id', 'de', 'ja', 'mr', 'te', 'tr', 'ta', 'yue', 'ko'
] as const;

export type SupportedLanguageCode = typeof supportedLanguages[number];
