'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Movie } from '@/zustand'
import { getMoviesByLanguage } from '@/apis/movie.api'
import { Language, getAllLanguages, getPopularLanguages } from '@/apis/language.api'
import MovieCard from './MovieCard'
import LoadingSpinner from '../LoadingSpinner'
import { useTranslation } from '@/contexts/translation.context'
import { TranslationKey } from '@/utils/translation.util'

/**
 * LanguageMovieSelector component
 * 
 * Displays movies grouped by popular languages in a horizontal scrollable layout.
 * On mount, fetches multiple popular languages and their associated movies.
 * Displays each language section with its own set of movies.
 * 
 * Features:
 * - Horizontal scrolling for movie cards
 * - Responsive design
 * - Internal loading states
 * - Fallback content for empty states
 * - Error handling
 * - Section-based layout similar to streaming platforms
 * - Navigation controls for horizontal scrolling
 */
interface LanguageMovieSelectorProps {
  title?: string
  limit?: number
  languageLimit?: number
  width?: string
  height?: string
}

interface MoviesByLanguage {
  language: Language;
  movies: Movie[];
  loading: boolean;
}

const LanguageMovieSelector: React.FC<LanguageMovieSelectorProps> = ({
  title = "International Movies",
  limit = 8,
  languageLimit = 5,
  width = "100%",
  height = "auto"
}) => {
  const [languagesLoading, setLanguagesLoading] = useState<boolean>(true)
  const [moviesByLanguage, setMoviesByLanguage] = useState<MoviesByLanguage[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  // Refs for scrolling movie sections
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([])

  const fetchMoviesForLanguage = useCallback(async (language: Language, index: number) => {
    try {
      // Update the specific language's loading state
      setMoviesByLanguage(current =>
        current.map((item, i) =>
          i === index ? { ...item, loading: true } : item
        )
      );

      const moviesData = await getMoviesByLanguage(language.iso_639_1, 1, limit);

      // Update the specific language's movies
      setMoviesByLanguage(current =>
        current.map((item, i) =>
          i === index ? {
            ...item,
            movies: moviesData.data || [],
            loading: false
          } : item
        )
      );
    } catch (error) {
      console.error(`Error fetching movies for ${language.name}:`, error);
      // Update with empty movies but mark as not loading
      setMoviesByLanguage(current =>
        current.map((item, i) =>
          i === index ? { ...item, loading: false, movies: [] } : item
        )
      );
    }
  }, [limit])

  // Fetch popular languages on component mount
  useEffect(() => {
    const fetchPopularLanguages = async () => {
      try {
        setLanguagesLoading(true)
        // Fetch the popular languages based on movie count
        const popularLanguages = await getPopularLanguages(languageLimit)

        if (popularLanguages && popularLanguages.length > 0) {
          setLanguages(popularLanguages)

          // Initialize moviesByLanguage with all languages
          const initialMoviesByLanguage = popularLanguages.map(language => ({
            language,
            movies: [],
            loading: true
          }))

          setMoviesByLanguage(initialMoviesByLanguage)
        } else {
          // Fallback to default languages if API returns empty
          const defaultLanguages = [
            { id: '1', iso_639_1: 'en', name: 'English', english_name: 'English' },
            { id: '2', iso_639_1: 'ko', name: 'Korean', english_name: 'Korean' },
            { id: '3', iso_639_1: 'ja', name: 'Japanese', english_name: 'Japanese' },
            { id: '4', iso_639_1: 'fr', name: 'French', english_name: 'French' },
            { id: '5', iso_639_1: 'es', name: 'Spanish', english_name: 'Spanish' }
          ]
          setLanguages(defaultLanguages)

          // Initialize with default languages
          const initialMoviesByLanguage = defaultLanguages.map(language => ({
            language,
            movies: [],
            loading: true
          }))

          setMoviesByLanguage(initialMoviesByLanguage)
        }
      } catch (error) {
        console.error('Error fetching popular languages:', error)
        setError('Failed to fetch languages')

        // Fallback to default languages if API fails
        const defaultLanguages = [
          { id: '1', iso_639_1: 'en', name: 'English', english_name: 'English' },
          { id: '2', iso_639_1: 'ko', name: 'Korean', english_name: 'Korean' },
          { id: '3', iso_639_1: 'ja', name: 'Japanese', english_name: 'Japanese' },
          { id: '4', iso_639_1: 'fr', name: 'French', english_name: 'French' },
          { id: '5', iso_639_1: 'es', name: 'Spanish', english_name: 'Spanish' }
        ]
        setLanguages(defaultLanguages)

        // Initialize with default languages
        const initialMoviesByLanguage = defaultLanguages.map(language => ({
          language,
          movies: [],
          loading: true
        }))

        setMoviesByLanguage(initialMoviesByLanguage)
      } finally {
        setLanguagesLoading(false)
      }
    }

    fetchPopularLanguages()
  }, [languageLimit])

  // Fetch movies for all languages once the moviesByLanguage state is set
  useEffect(() => {
    if (moviesByLanguage.length > 0 && !languagesLoading) {
      // Fetch movies for each language in parallel
      moviesByLanguage.forEach((item, index) => {
        fetchMoviesForLanguage(item.language, index)
      })
    }
  }, [moviesByLanguage.length, languagesLoading, fetchMoviesForLanguage])

  // Scroll functions for the movie rows
  const scrollLeft = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      const container = scrollContainerRefs.current[index]
      if (container) {
        container.scrollBy({ left: -300, behavior: 'smooth' })
      }
    }
  }

  const scrollRight = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      const container = scrollContainerRefs.current[index]
      if (container) {
        container.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }
  }

  // Return a flexible height container when there's an error
  if (error) {
    return (
      <div className="text-center text-red-500 p-4 bg-gray-800/30 rounded-lg border border-gray-700" style={{ width }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xl">{error}</p>
        <p className="text-sm text-gray-400 mt-2">{t('Please try again later')}</p>
      </div>
    )
  }

  return (
    <div className="w-full container mx-auto px-4 py-8 min-h-[600px]" style={{ width }}>
      <h2 className="text-3xl font-bold text-white mb-8">{t(title as TranslationKey) || title}</h2>

      {languagesLoading ? (
        <div className="w-full flex justify-center items-center h-96">
          <div className="w-full flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-300 animate-pulse">{t('Loading languages...')}</p>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-12" style={{ height, overflow: 'auto' }}>
          {moviesByLanguage.map((item, index) => (
            <div key={item.language.iso_639_1} className="language-section w-full">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {(item.language.name || item.language.english_name + ' ' + 'Movies')}
                </h3>

                {/* Navigation controls */}
                <div className="flex space-x-2">
                  <NaviagationLeftButton onClick={() => scrollLeft(index)} />
                  <NavigationRightButton onClick={() => scrollRight(index)} />
                </div>
              </div>

              {item.loading ? (
                <div className="bg-gray-800/30 rounded-lg h-113 flex justify-center items-center w-full">
                  <div className="flex flex-col items-center w-full">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-300 animate-pulse">{t('Loading')} {item.language.name || item.language.english_name} {t('movies...')}</p>
                  </div>
                </div>
              ) : item.movies.length === 0 ? (
                <div className="text-center text-gray-300 py-12 bg-gray-800/30 rounded-lg border border-gray-700 h-80 flex flex-col justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                  </svg>
                  <p className="text-xl">{t('No movies found for')} {item.language.name || item.language.english_name}</p>
                </div>
              ) : (
                <div
                  className="flex space-x-4 overflow-x-auto hide-scrollbar min-h-[320px]"
                  ref={(el) => { scrollContainerRefs.current[index] = el }}
                >
                  {item.movies.map((movie) => (
                    <div key={movie.id} className="flex-none w-48 md:w-56">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const NaviagationLeftButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
    aria-label="Scroll left"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
)
const NavigationRightButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
    aria-label="Scroll right"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
)

export default LanguageMovieSelector
