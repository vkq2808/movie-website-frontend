'use client'
import React from 'react'
import { PlayIcon, HeartIcon, InfoIcon } from 'lucide-react'

interface MovieHeroProps {
  title: string
  rating: number
  resolution: string
  year: string
  episode: string
  genres: string[]
  description: string
  backgroundImage: string
}

const MovieHero: React.FC<MovieHeroProps> = ({
  title,
  rating,
  resolution,
  year,
  episode,
  genres,
  description,
  backgroundImage,
}) => {
  return (
    <div className="relative w-full h-screen text-white flex items-center justify-between overflow-hidden px-16">
      {/* Ảnh nền */}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Overlay tối */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent opacity-80 z-0"></div>

      {/* Nội dung bên trái */}
      <div className="relative z-10 max-w-[45%] space-y-4 pt-72">
        <h1 className="text-4xl font-bold">{title}</h1>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded">IMDb {rating}</span>
          <span className="bg-white text-black px-2 py-0.5 rounded">{resolution}</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded">{year}</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded">{episode}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {genres.map((genre, index) => (
            <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
              {genre}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-200 leading-relaxed">{description}</p>

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