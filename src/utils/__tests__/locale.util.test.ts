/**
 * @jest-environment jsdom
 */

import { getLanguageCodeFromCountry, getLanguageName, getCountryInfo } from '../locale.util';

// Mock the i18n-iso-countries module
jest.mock('i18n-iso-countries', () => {
  return {
    getName: jest.fn((code) => {
      const mockNames = {
        'US': 'United States',
        'FR': 'France',
        'JP': 'Japan',
        'DE': 'Germany',
        'CN': 'China',
      };
      return mockNames[code] || null;
    }),
    registerLocale: jest.fn(),
  };
});

describe('Frontend Locale Utilities', () => {
  describe('getLanguageCodeFromCountry', () => {
    it('should return appropriate language codes for country codes', () => {
      expect(getLanguageCodeFromCountry('US')).toBe('en');
      expect(getLanguageCodeFromCountry('GB')).toBe('en');
      expect(getLanguageCodeFromCountry('FR')).toBe('fr');
      expect(getLanguageCodeFromCountry('DE')).toBe('de');
      expect(getLanguageCodeFromCountry('JP')).toBe('ja');
      expect(getLanguageCodeFromCountry('CN')).toBe('zh');
    });

    it('should return default "en" for empty or invalid country codes', () => {
      expect(getLanguageCodeFromCountry('')).toBe('en');
      expect(getLanguageCodeFromCountry(null)).toBe('en');
      expect(getLanguageCodeFromCountry('XX')).toBe('en'); // Non-existent code
    });

    it('should handle lowercase country codes', () => {
      expect(getLanguageCodeFromCountry('us')).toBe('en');
      expect(getLanguageCodeFromCountry('fr')).toBe('fr');
    });
  });

  describe('getLanguageName', () => {
    it('should return appropriate language names for language codes', () => {
      expect(getLanguageName('en')).toBe('English');
      expect(getLanguageName('fr')).toBe('Français');
      expect(getLanguageName('de')).toBe('Deutsch');
      expect(getLanguageName('ja')).toBe('日本語');
      expect(getLanguageName('zh')).toBe('中文');
    });

    it('should return the code itself for unsupported language codes', () => {
      expect(getLanguageName('xx')).toBe('xx'); // Non-existent code
    });
  });

  describe('getCountryInfo', () => {
    it('should return country information for valid country codes', () => {
      const usInfo = getCountryInfo('US');
      expect(usInfo.name).toBe('United States');
      expect(usInfo.code).toBe('US');

      const frInfo = getCountryInfo('FR');
      expect(frInfo.name).toBe('France');
      expect(frInfo.code).toBe('FR');
    });

    it('should handle invalid country codes gracefully', () => {
      const invalidInfo = getCountryInfo('XX');
      expect(invalidInfo.name).toBe('XX');
    });
  });
});
