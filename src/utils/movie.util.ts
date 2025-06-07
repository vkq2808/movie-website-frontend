import { Movie } from "@/zustand";
import { getLanguageCodeFromCountry } from "./locale.util";

export const getMovieTitleByLanguage = (
  movie: Movie,
  languageCode: string
): string => {
  // Check if the movie has an alternative title in the specified language
  const alternativeTitle = movie.alternative_titles.find(
    (title) => title.iso_639_1 === languageCode
  );

  // If found, return the alternative title; otherwise, return the original title
  return alternativeTitle ? alternativeTitle.title : movie.title || 'No title available.';
}

export const getMovieOverviewByLanguage = (
  movie: Movie,
  languageCode: string
): string => {
  // Check if the movie has an alternative overview in the specified language
  const alternativeOverview = movie.alternative_overviews.find(
    (overview) => overview.iso_639_1 === languageCode
  );

  // If found, return the alternative overview; otherwise, return the original overview
  return alternativeOverview ? alternativeOverview.overview : movie.overview || 'No description available.';
}

/**
 * Converts ISO 3166-1 country code to ISO 639-1 language code
 * This function delegates to the more robust implementation in locale.util.ts
 * 
 * @param countryCode ISO 3166-1 country code (e.g., 'US', 'FR', 'JP')
 * @returns ISO 639-1 language code (e.g., 'en', 'fr', 'ja')
 */
export const getLanguageFromCountry = (countryCode: string): string => {
  // Use the shared implementation from locale.util.ts
  const { getLanguageCodeFromCountry } = require('./locale.util');
  return getLanguageCodeFromCountry(countryCode);
}