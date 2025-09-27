'use client'
import React from 'react'
import { Genre, Movie } from '@/zustand'
import { Play, Heart, Share, MessageCircle, PlusCircle } from 'lucide-react'
import { getMovieOverviewByLanguage, getMovieTitleByLanguage } from '@/utils/movie.util'
import { useLanguage } from '@/contexts/language.context'
import Image from 'next/image'
import MoviePurchaseButton from '@/components/common/MoviePurchase/MoviePurchaseButton'
import { maximizeTextLength } from '@/utils/string.util'

interface MovieHeroProps {
  movie: Movie
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const { language } = useLanguage();

  const handleLikeButtonClick = () => {
    // Handle like button click logic here
    console.log('Like button clicked');
  }

  const handleAddToWatchlistClick = () => {
    // Handle add to watchlist logic here
    console.log('Add to watchlist clicked');
  }

  const handleShareClick = () => {
    // Handle share logic here
    console.log('Share clicked');
  }

  const handleCommentClick = () => {
    // Handle comment logic here
    console.log('Comment clicked');
  }


  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names?.find((n) => n.iso_639_1 === language)
    return nameForLanguage ? nameForLanguage.name : genre.names?.[0]?.name || 'Không xác định'
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.backdrops?.[0]?.url || movie.posters?.[0]?.url}
          alt={movie.backdrops?.[0]?.alt || movie.title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-8 pb-32">
          <div className="flex gap-8 items-start">
            {/* Movie Poster */}
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
              {/* Title */}
              <h1 className="text-5xl font-bold text-white mb-4">
                {getMovieTitleByLanguage(movie, language)}
              </h1>

              {/* Action Buttons */}
              <div className="flex items-start gap-6 mb-6">
                {/* Left side - Play and social buttons */}
                <div className="flex items-center gap-4">
                  {/* <button className="flex items-center gap-3 bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors cursor-pointer">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Xem ngay
                  </button> */}
                  <div className="flex-shrink-0 w-72">
                    <MoviePurchaseButton
                      movie={movie}
                      onPurchaseSuccess={() => {
                        // Optionally refresh movie data or show success message
                        console.log('Movie purchased successfully!');
                      }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={handleLikeButtonClick}
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={handleAddToWatchlistClick}
                    >
                      <PlusCircle className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={handleShareClick}
                    >
                      <Share className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={handleCommentClick}
                    >
                      <MessageCircle className="w-5 h-5 text-yellow-500" />
                    </button>

                  </div>
                </div>
              </div>

              {/* Movie Meta Info */}
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    {movie.vote_average?.toFixed(1) || '?'} ★
                  </span>
                  <span>Đánh giá</span>
                </div>
                <span>•</span>
                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                <span>•</span>
                <span>{movie.duration ? `${movie.duration} phút` : 'N/A'}</span>
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

              {/* Description */}
              <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                {maximizeTextLength(getMovieOverviewByLanguage(movie, language), 640)}
              </p>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default MovieHero
