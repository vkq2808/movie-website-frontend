import { Movie } from "@/zustand";

export const getMovieTitleByLanguage = (
  movie: Movie,
  languageCode: string
): string => {
  // Check if the movie has an alternative title in the specified language
  const alternativeTitle = movie.alternative_titles.find(
    (title) => title.iso_639_1 === languageCode
  );

  // If found, return the alternative title; otherwise, return the original title
  return alternativeTitle ? alternativeTitle.title : movie.original_title || 'No title available.';
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