'use client'
import React from 'react'
import { PlayIcon, HeartIcon, InfoIcon } from 'lucide-react'
import { Movie, useLanguageStore } from '@/zustand'

interface MovieHeroProps {
  movie: Movie,
}

const MovieHero: React.FC<MovieHeroProps> = ({
  movie
}) => {
  const currentLanguage = useLanguageStore(state => state.currentLanguage)
  return (
    <div className="relative w-full h-[80vh] text-white flex items-center justify-between overflow-hidden px-16">
      {/* Ảnh nền */}
      {movie.backdrop?.url && <img
        src={movie.backdrop?.url}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />}

      {/* Overlay tối */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent via-10% to-transparent opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-10% to-transparent opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent via-5% to-transparent opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent via-5% to-transparent opacity-90 z-0"></div>

      {/* Nội dung bên trái */}
      <div className="relative z-10 max-w-[45%] space-y-4 pt-72">
        <h1 className="text-4xl font-bold">{movie.title}</h1>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded">IMDb {movie.rating}</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded">{movie.release_date.split('-')[0]}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {movie.genres.map((genre, index) => (
            <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
              {genre.names.find((n: any) => n.iso_639_1 === currentLanguage.iso_639_1)?.name || genre.names[0]?.name || 'Unknown'}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-200 leading-relaxed">{movie.overview || 'No overview available.'}</p>

        <div className="flex gap-4 pt-4">
          <button className="bg-yellow-400 text-black p-4 rounded-full hover:scale-105 transition">
            <PlayIcon className="w-6 h-6" />
          </button>
          <button className="border border-white p-4 rounded-full hover:bg-white hover:text-black transition">
            <HeartIcon className="w-6 h-6" />
          </button>
          <button className="border border-white p-4 rounded-full hover:bg-white hover:text-black transition">
            <InfoIcon className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  )
}

export default MovieHero