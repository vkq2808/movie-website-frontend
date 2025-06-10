/**
 * Enhanced translation utility with better organization and type safety
 */
import { SupportedLanguage } from './locale.util';
import { allTranslations } from './translations';

// Define translation key categories for better organization
export type NavigationAndMenuKey =
  | 'Home'
  | 'Profile'
  | 'Settings'
  | 'Search'
  | 'Genres'
  | 'MyLogo';

export type AuthenticationKey =
  | 'Login'
  | 'Register'
  | 'Logout'
  | 'Email'
  | 'Password'
  | 'Confirm Password'
  | 'Forgot Password'
  | 'Reset Password'
  | 'Change Password';

export type UserAccountAndSettingsKey =
  | 'Update Profile'
  | 'Save Changes'
  | 'Account Settings';

export type MoviesAndContentKey =
  | 'Movies'
  | 'Watch Now'
  | 'Discover Movies By Language'
  | 'Featured International Movies'
  | 'All genres'
  | 'Movie Categories'
  | 'Top Rated Movies'
  | 'New Releases'
  | 'Upcoming Films'
  | 'No movies found for'
  | 'No poster'
  | 'Add to Favorites'
  | 'Add to Watchlist'
  | 'Share'
  | 'Comment'
  | 'Rating'
  | 'Duration'
  | 'Unknown'
  | 'Movie not found'
  | 'Loading movie details...'
  | 'International Movies'
  | 'movies...'
  | 'Based on similar genres and ratings'
  | 'No overview available.'
  | 'N/A'
  | 'minutes'
  | 'votes'
  | 'No image'
  | 'View Details'

export type SearchAndNavigationKey =
  | 'Search movies, actors'
  | 'Country'
  | 'Type'
  | 'Rating'
  | 'Sort by'
  | 'Genre'
  | 'Year'
  | 'Search results for'
  | 'results found'
  | 'Try Again'
  | 'Previous page'
  | 'Next page'
  | 'Try adjusting your search or filters to find what you\'re looking for'
  | 'An unexpected error occurred while fetching search results. Please try again later.'

export type LoadingStatesKey =
  | 'Loading'
  | 'Loading languages...'
  | 'Loading featured movies...'
  | 'Loading genres...'
  | 'Loading movies...';

export type FooterQuickLinksKey =
  | 'Quick Links';

export type FooterCustomerSupportKey =
  | 'Customer Support'
  | 'Contact Us'
  | 'FAQ'
  | 'Help Center'
  | 'Subscription Support';

export type FooterLegalKey =
  | 'Legal'
  | 'Privacy Policy'
  | 'Terms of Service'
  | 'Cookie Policy'
  | 'About Us';

export type FooterNewsletterKey =
  | 'Stay Updated'
  | 'Enter your email'
  | 'Subscribe';

export type FooterCopyrightKey =
  | 'All rights reserved.';

export type ErrorMessagesAndGeneralKey =
  | 'Please try again later';

export type TabContentKey =
  | 'Episode'
  | 'Episodes'
  | 'Gallery'
  | 'Cast'
  | 'Crew'
  | 'Suggestion'
  | 'Click to play trailer'
  | 'No video available'
  | 'Episode List'
  | 'Subtitles'
  | 'Full Movie'
  | 'Vietnamese subtitles'
  | 'DUB'
  | 'Full Movie (Dubbed)'
  | 'Vietnamese dubbed'
  | 'Movie Information'
  | 'Release Year'
  | 'Screenshots'
  | 'Posters'
  | 'Poster'
  | 'Screenshot'
  | 'No image available'
  | 'No gallery images available'
  | 'Production Information'
  | 'Director'
  | 'Director Name'
  | 'Producer'
  | 'Producer Name'
  | 'Writer'
  | 'Writer Name'
  | 'Composer'
  | 'Composer Name'
  | 'Character Details'
  | 'as'
  | 'No details available.'
  | 'Suggested Movies'
  | 'You May Also Like';

export type FooterKey =

  | FooterQuickLinksKey
  | FooterCustomerSupportKey
  | FooterLegalKey
  | FooterNewsletterKey
  | FooterCopyrightKey

// Combine all translation key categories into the main TranslationKey type
export type TranslationKey =
  | NavigationAndMenuKey
  | AuthenticationKey
  | UserAccountAndSettingsKey
  | MoviesAndContentKey
  | SearchAndNavigationKey
  | LoadingStatesKey
  | ErrorMessagesAndGeneralKey
  | TabContentKey
  | FooterKey;

// Define translations by language instead of by key for better organization
interface TranslationsByLanguage {
  [key: string]: Record<TranslationKey, string>;
}

export const translations: TranslationsByLanguage = allTranslations;

/**
 * Returns the translation for a given key in the specified language
 * Falls back to English if translation is not available
 * 
 * @param key The translation key
 * @param language The target language code
 * @returns The translated string
 */
export function translate(key: TranslationKey, language: SupportedLanguage = 'en'): string {
  // First check if we have this language
  if (!translations[language]) {
    return translations.en[key] || key;
  }

  // Then check if we have this key in the language
  return translations[language][key] || translations.en[key] || key;
}

/**
 * Get all translations for a specific language
 * 
 * @param language The language code
 * @returns Record of all translations for that language
 */
export function getTranslationsForLanguage(language: SupportedLanguage): Record<TranslationKey, string> {
  return translations[language] || translations.en;
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(key: string): key is TranslationKey {
  return key in translations.en;
}

export default translate;
