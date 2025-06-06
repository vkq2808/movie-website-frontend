'use client'
import React from 'react'
import { Movie } from '@/zustand'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface SearchMovieCardProps {
  movie: Movie
}

const SearchMovieCard: React.FC<SearchMovieCardProps> = ({ movie }) => {
  return (
    <Link href={`/movie/${movie.id}`} className="block group">
      <div className="relative h-full overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        {/* Movie Poster */}
        <div className="aspect-[2/3] bg-gray-800">
          {movie.poster ? (
            <img
              src={movie.poster.url}
              alt={movie.poster.alt || movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
              <span>No Image</span>
            </div>
          )}
        </div>

        {/* Movie Info Overlay - Shows on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
          {/* Movie Rating */}
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs ml-1 text-white">{movie.rating || 'N/A'}</span>
          </div>

          {/* Movie Title */}
          <h3 className="text-sm font-medium text-white line-clamp-2">{movie.title}</h3>

          {/* Release Year */}
          <div className="text-xs text-gray-300">
            {movie.release_date && new Date(movie.release_date).getFullYear()}
          </div>
        </div>
      </div>

      {/* Movie Title - Visible always */}
      <h3 className="mt-2 text-sm font-medium text-white line-clamp-1">{movie.title}</h3>

      {/* Movie Info - Visible always */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">
          {movie.release_date && new Date(movie.release_date).getFullYear()}
        </span>
        <div className="flex items-center">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs ml-1 text-gray-400">{movie.rating || 'N/A'}</span>
        </div>
      </div>
    </Link>
  )
}

export default SearchMovieCard
