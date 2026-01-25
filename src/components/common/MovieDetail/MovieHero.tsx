'use client'
import React, { useState, useEffect } from 'react'
import { useLanguageStore } from '@/zustand'
import { Heart, Share, MessageCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button';
import AddToListButton from '@/components/movie-list/AddToListButton'
import Image from 'next/image'
import MoviePurchaseButton from '@/components/common/MovieDetail/MoviePurchaseButton'
import { maximizeTextLength } from '@/utils/string.util'
import clsx from 'clsx'
import { Genre, Movie } from '@/types/api.types'
import { useAuthStore } from '@/zustand/auth.store'
import { toggleFavorite, getFavoriteStatus } from '@/apis/favorite.api'
import { useRouter } from 'next/navigation'

interface MovieHeroProps {
  movie: Movie
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const language = useLanguageStore((s) => s.currentLanguage)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // --- Fetch initial favorite status on mount ---
  useEffect(() => {
    // Only fetch if user is logged in and movie ID exists
    if (!user || !movie?.id) {
      setIsInitializing(false);
      return;
    }

    const fetchStatus = async () => {
      setIsInitializing(true);
      try {
        const response = await getFavoriteStatus(movie.id);
        if (response.success && response.data) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (error) {
        setIsFavorite(false);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchStatus();
  }, [user, movie?.id]);

  // --- Xác định video trailer hợp lệ ---
  const mainVideo =
    movie.videos?.find((v) => v.type === 'Trailer' && v.url) ||
    movie.videos?.find((v) => v.url)

  // --- Get genre name theo ngôn ngữ ---
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names?.find(
      (n) => n.iso_639_1 === language.iso_639_1
    )
    return nameForLanguage ? nameForLanguage.name : genre.names?.[0]?.name || 'Không xác định'
  }

  // --- Handle favorite button click ---
  const handleToggleFavorite = async () => {
    // Check if user is logged in
    if (!user) {
      router.push('/auth/login')
      return
    }

    setIsLoadingFavorite(true)
    setErrorMessage(null)

    try {
      const response = await toggleFavorite(movie.id)
      
      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite)
      } else {
        setErrorMessage(response.message || 'Failed to toggle favorite')
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to toggle favorite'
      setErrorMessage(errorMsg)
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* --- BACKDROP (hiển thị trước hoặc fallback khi không có video) --- */}
      <div
        className={clsx(
          'absolute inset-0 transition-opacity duration-1000',
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Image
          src={movie.backdrops?.[0]?.url || movie.posters?.[0]?.url}
          alt={movie.backdrops?.[0]?.alt || movie.title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      {/* --- VIDEO BACKGROUND --- */}
      {mainVideo && mainVideo.url && (
        <div
          className={clsx(
            'absolute inset-0 transition-opacity duration-1000',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <iframe
            src={`${mainVideo.url}?autoplay=1&mute=1&loop=1&playsinline=1&controls=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={() => setIsVideoLoaded(true)}
            onError={() => {
              setIsVideoLoaded(false)
              setHasError(true)
            }}
          />

          {/* Gradient overlay để readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </div>
      )}

      {/* --- HERO CONTENT --- */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-8 pb-32">
          <div className="flex gap-8 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                {movie.posters?.[0] ? (
                  <Image
                    src={movie.posters?.[0].url}
                    alt={movie.posters?.[0].alt || movie.title}
                    className="w-full h-full object-cover"
                    width={256}
                    height={384}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">Không có poster</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-6">
              <h1 className="text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-60">
                  <MoviePurchaseButton
                    movie={movie}
                    onPurchaseSuccess={() => console.log('Movie purchased successfully!')}
                  />
                </div>

                <div className="flex gap-4">
                  {/* Favorite Button */}
                  <Button variant="ghost" size="icon" aria-label="Add to playlist" 

                    onClick={handleToggleFavorite}
                    className={clsx(
                      'p-3 rounded-full transition-all duration-200',
                      isFavorite
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-800 hover:bg-gray-700',
                      (isLoadingFavorite || isInitializing) && 'opacity-50 cursor-not-allowed'
                    )}
                    title={user ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Please login to add to favorites'}
                  >
                    <Heart
                      className={clsx(
                        'w-5 h-5 transition-all duration-200',
                        isFavorite ? 'fill-white text-white' : 'text-red-500'
                      )}
                    />
                  </Button>

                  {/* Add to Playlist Button */}
                  <div title="Add to your playlist">
                    <AddToListButton movieId={movie.id} />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded">
                  {errorMessage}
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    {movie.vote_average?.toFixed(1) || '?'} ★
                  </span>
                </div>
                <span>•</span>
                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.slice(0, 4).map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-800/60 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600"
                  >
                    {getGenreName(genre)}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                {maximizeTextLength(movie.overview, 640)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieHero
