import { Movie } from "@/types/api.types";
// Import the localeConverter from the new simplified util
import localeConverter from "./locale.util";


/**
 * Converts ISO 3166-1 country code to ISO 639-1 language code
 * This function now uses the simplified locale converter
 * 
 * @param countryCode ISO 3166-1 country code (e.g., 'US', 'FR', 'JP')
 * @returns ISO 639-1 language code (e.g., 'en', 'fr', 'ja')
 */
export const getLanguageFromCountry = (countryCode: string): string => {
  // Use the new localeConverter.countryToLanguage method
  return localeConverter.countryToLanguage(countryCode);
}

// Additional examples of using the new locale converter

/**
 * Get the native name of a language
 */
export const getLanguageName = (languageCode: string): string => {
  return localeConverter.languageToName(languageCode);
}

/**
 * Parse a locale string into language and country components
 */
export const parseLocale = (locale: string) => {
  return localeConverter.parseLocale(locale);
}

/**
 * Create a locale string from language and country codes
 */
export const createLocale = (languageCode: string, countryCode?: string): string => {
  return localeConverter.createLocale(languageCode, countryCode);
}
