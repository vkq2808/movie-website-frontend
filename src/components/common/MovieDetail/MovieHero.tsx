'use client'
import React from 'react'
import { Genre, Movie } from '@/zustand'
import { Play, Heart, Share, MessageCircle } from 'lucide-react'
import { getMovieOverviewByLanguage, getMovieTitleByLanguage } from '@/utils/movie.util'
import { useLanguage } from '@/contexts/language.context'
import Image from 'next/image'

interface MovieHeroProps {
  movie: Movie
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const { language } = useLanguage();

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
          src={movie.backdrop?.url || movie.poster?.url}
          alt={movie.backdrop?.alt || movie.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-8 pb-32">
          <div className="flex gap-8 items-end">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                {movie.poster ? (
                  <Image
                    src={movie.poster.url}
                    alt={movie.poster.alt || movie.title}
                    className="w-full h-full object-cover"
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
              <div className="flex items-center gap-4 mb-6">
                <button className="flex items-center gap-3 bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Xem ngay
                </button>

                <div className="flex gap-4">
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <Heart className="w-6 h-6 text-white" />
                    <span className="sr-only">Thêm vào yêu thích</span>
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <div className="w-6 h-6 text-white font-bold text-xs flex items-center justify-center">+</div>
                    <span className="sr-only">Thêm vào danh sách xem</span>
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <Share className="w-6 h-6 text-white" />
                    <span className="sr-only">Chia sẻ</span>
                  </button>
                  <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="sr-only">Bình luận</span>
                  </button>
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

              {/* Rating Badge */}
              <div className="flex items-center justify-end">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="text-2xl font-bold">{movie.vote_average?.toFixed(1) || '?'}</span>
                  <span className="text-sm opacity-75">Đánh giá</span>
                </div>
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
                {getMovieOverviewByLanguage(movie, language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieHero
