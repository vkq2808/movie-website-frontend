/**
 * Utilities for handling locale, language, and country code conversions
 * This file contains helper functions that work in both client and server environments
 */

/**
 * Safely loads the i18n-iso-countries library (only on client-side)
 * @returns The countries library instance or null if unavailable
 */
export const loadCountriesLib = () => {
  if (typeof window !== 'undefined') {
    try {
      const countries = require('i18n-iso-countries');
      // Register at least English locale for country names
      countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
      return countries;
    } catch (error) {
      console.warn('Failed to load i18n-iso-countries library:', error);
      return null;
    }
  }
  return null;
};

/**
 * Gets the native language name for a given language code
 * @param languageCode ISO 639-1 language code
 * @returns The native name of the language
 */
export const getLanguageName = (languageCode: string): string => {
  // Common languages with their native names
  const languageNames: Record<string, string> = {
    'en': 'English',
    'fr': 'Français',
    'de': 'Deutsch',
    'es': 'Español',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'zh': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'ar': 'العربية',
    'hi': 'हिन्दी',
    'vi': 'Tiếng Việt',
    'th': 'ไทย',
    'id': 'Bahasa Indonesia',
    'ms': 'Bahasa Melayu',
    'nl': 'Nederlands',
    'sv': 'Svenska',
    'no': 'Norsk',
    'da': 'Dansk',
    'fi': 'Suomi',
    'pl': 'Polski',
    'tr': 'Türkçe',
    'cs': 'Čeština',
    'el': 'Ελληνικά',
    'he': 'עברית',
    'uk': 'Українська'
  };

  return languageNames[languageCode] || languageCode;
};

/**
 * Gets country information from a country code
 * @param countryCode ISO 3166-1 country code
 * @returns Country name and other details if available
 */
export const getCountryInfo = (countryCode: string) => {
  const countries = loadCountriesLib();
  if (!countries) return { name: countryCode };

  try {
    const name = countries.getName(countryCode.toUpperCase(), 'en');
    return {
      name,
      code: countryCode.toUpperCase(),
      // Add more information as needed
    };
  } catch (e) {
    return { name: countryCode };
  }
};

/**
 * Alternative approach using Intl.DisplayNames API for modern browsers
 * This only works in client-side code with modern browsers that support this API
 */
export const getCountryNameFromCode = (countryCode: string): string => {
  if (typeof window === 'undefined') return countryCode; // SSR check

  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(countryCode.toUpperCase()) || countryCode;
    }
  } catch (e) {
    // Fallback to basic handling
  }

  return countryCode;
};

/**
 * Alternative approach using Intl.DisplayNames API for modern browsers
 * This only works in client-side code with modern browsers that support this API
 */
export const getLanguageNameFromCode = (languageCode: string): string => {
  if (typeof window === 'undefined') return getLanguageName(languageCode); // SSR check with fallback

  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
      return languageNames.of(languageCode) || getLanguageName(languageCode);
    }
  } catch (e) {
    // Fallback to basic handling
  }

  return getLanguageName(languageCode);
};

/**
 * Directly get a language code from a country code
 * This is a wrapper around the implementation in movie.util.ts for consistency
 * 
 * @param countryCode ISO 3166-1 country code (e.g., 'US', 'FR', 'JP')
 * @returns ISO 639-1 language code (e.g., 'en', 'fr', 'ja')
 */
export const getLanguageCodeFromCountry = (countryCode: string): string => {
  if (!countryCode) return 'en';

  try {
    // Standardize the input
    const code = countryCode.toUpperCase();

    // Option 1: Use the browser's Intl API if available (modern browsers)
    if (typeof window !== 'undefined' && typeof Intl !== 'undefined' && Intl.Locale) {
      try {
        // Create a locale from the country code
        const locale = new Intl.Locale(code);
        // If the locale has a language, use it
        if (locale.language) {
          return locale.language;
        }
      } catch (e) {
        // Continue to fallback if browser API fails
      }
    }

    // Option 2: Use the i18n-iso-countries library
    const countries = loadCountriesLib();
    if (countries) {
      // Some countries have a direct mapping from country to language
      // This is a simplified approach for the most common cases
      const countryInfo = countries.getName(code, 'en');
      if (countryInfo) {
        // For many countries, we can derive the language from country names
        const languageMap: Record<string, string> = {
          'United States': 'en',
          'United Kingdom': 'en',
          'France': 'fr',
          'Germany': 'de',
          'Italy': 'it',
          'Spain': 'es',
          'Portugal': 'pt',
          'Japan': 'ja',
          'China': 'zh',
          'Russia': 'ru',
          'Vietnam': 'vi',
          'Thailand': 'th',
          'South Korea': 'ko',
          'Saudi Arabia': 'ar',
          'Brazil': 'pt',
          'Mexico': 'es',
        };

        if (languageMap[countryInfo]) {
          return languageMap[countryInfo];
        }
      }
    }

    // Option 3: Fallback to a basic mapping for the most common countries
    const fallbackMap: Record<string, string> = {
      // Most common countries by ISO code
      US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en',
      FR: 'fr', DE: 'de', IT: 'it', ES: 'es', PT: 'pt',
      NL: 'nl', BE: 'nl', CH: 'de', AT: 'de', DK: 'da',
      SE: 'sv', NO: 'no', FI: 'fi', GR: 'el', PL: 'pl',
      CZ: 'cs', HU: 'hu', RU: 'ru', CN: 'zh', TW: 'zh',
      HK: 'zh', JP: 'ja', KR: 'ko', TH: 'th', VN: 'vi',
      ID: 'id', MY: 'ms', SG: 'en', IN: 'hi', SA: 'ar',
      AE: 'ar', EG: 'ar', IL: 'he', TR: 'tr', IR: 'fa',
      MX: 'es', BR: 'pt', AR: 'es', CL: 'es', CO: 'es',
      BY: 'ru', UA: 'uk', KZ: 'kk'
    };

    if (fallbackMap[code]) {
      return fallbackMap[code];
    }

    // Default to English if all methods fail
    return 'en';
  } catch (error) {
    console.error('Error converting country code to language code:', error);
    return 'en';
  }
};
