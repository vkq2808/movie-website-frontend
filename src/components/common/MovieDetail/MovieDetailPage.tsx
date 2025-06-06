'use client'
import React, { useState, useEffect } from 'react'
import { Movie, useLanguageStore } from '@/zustand'
import { getMovieById } from '@/apis/movie.api'
import MovieHero from './MovieHero'
import MovieTabs from './MovieTabs'
import Spinner from '../Spinner'

interface MovieDetailPageProps {
  movieId: string
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { currentLanguage } = useLanguageStore()

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const movieData = await getMovieById(movieId)
        console.log('Fetched movie data:', movieData)
        setMovie(movieData)
      } catch (error) {
        console.error('Error fetching movie details:', error)
        setError('Failed to load movie details')
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Spinner size="lg" color="text-yellow-400" />
          <p className="mt-4 text-white animate-pulse">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error || 'Movie not found'}</p>
          <p className="text-sm text-gray-400 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Movie Hero Section */}
      <MovieHero movie={movie} />

      {/* Movie Details and Tabs Section */}
      <div className="bg-black text-white">
        <MovieTabs movie={movie} />
      </div>
    </main>
  )
}

export default MovieDetailPage
