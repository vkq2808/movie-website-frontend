'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Genre, Movie, useLanguageStore } from '@/zustand'
import { Heart, Share, MessageCircle, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import MoviePurchaseButton from '@/components/common/MoviePurchase/MoviePurchaseButton'
import { maximizeTextLength } from '@/utils/string.util'
import clsx from 'clsx'

interface MovieHeroProps {
  movie: Movie
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const language = useLanguageStore(s => s.currentLanguage)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // --- Xác định trailer URL ---
  const mainVideo = movie.videos?.find(v => v.type === 'Trailer') || movie.videos?.[0]
  const videoUrl =
    mainVideo?.site === 'YouTube'
      ? `https://www.youtube.com/embed/${mainVideo.key}?autoplay=1&mute=1&loop=1&playlist=${mainVideo.key}&controls=0&modestbranding=1&showinfo=0`
      : mainVideo?.site === 'Vimeo'
        ? `https://player.vimeo.com/video/${mainVideo.key}?autoplay=1&muted=1&loop=1&background=1`
        : null

  // --- Event handler video load ---
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  // --- Get genre name theo ngôn ngữ ---
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names?.find((n) => n.iso_639_1 === language.iso_639_1)
    return nameForLanguage ? nameForLanguage.name : genre.names?.[0]?.name || 'Không xác định'
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* --- BACKDROP (hiển thị trước khi video load) --- */}
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
      {videoUrl && (
        <div
          className={clsx(
            'absolute inset-0 transition-opacity duration-1000',
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Vì YouTube iframe không có event “onLoadedData”, nên ta dùng overlay fade */}
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onLoad={handleVideoLoaded}
          ></iframe>

          {/* Gradient overlay để đảm bảo readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </div>
      )}

      {/* --- HERO CONTENT --- */}
      <div className="relative z-10 h-full flex items-end">
        <div className="container mx-auto px-8 pb-32">
          <div className="flex gap-8 items-start">
            {/* --- Poster --- */}
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

            {/* --- Movie Info --- */}
            <div className="flex-1 space-y-6">
              {/* Title */}
              <h1 className="text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              {/* Action Buttons */}
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-72">
                  <MoviePurchaseButton
                    movie={movie}
                    onPurchaseSuccess={() => console.log('Movie purchased successfully!')}
                  />
                </div>

                <div className="flex gap-4">
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <PlusCircle className="w-5 h-5 text-blue-500" />
                  </button>
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <Share className="w-5 h-5 text-green-500" />
                  </button>
                  <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                    <MessageCircle className="w-5 h-5 text-yellow-500" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
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
