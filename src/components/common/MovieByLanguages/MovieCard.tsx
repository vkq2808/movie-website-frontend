'use client'
import React from 'react'
import { Movie, useLanguageStore } from '@/zustand'
import Link from 'next/link'

interface MovieCardProps {
  movie: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage)

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-800 h-full">
        {/* Movie poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {movie.poster && (
            <img
              src={movie.poster.url}
              alt={movie.poster.alt || movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {!movie.poster && (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No poster available</span>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
            {movie.vote_average?.toFixed(1) || '?'} ★
          </div>
        </div>

        {/* Movie info */}
        <div className="p-4">
          <h3 className="text-white font-medium text-lg mb-1 line-clamp-1">{movie.title}</h3>
          <div className="flex items-center text-sm text-gray-300 mb-2">
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {movie.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
              >
                {genre.names?.find(n => n.iso_639_1 === currentLanguage.iso_639_1)?.name || genre.names?.[0]?.name || ''}
              </span>
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-bold px-4 py-2 bg-yellow-400 rounded-full">View Details</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
