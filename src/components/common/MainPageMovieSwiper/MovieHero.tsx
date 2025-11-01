'use client'
import React from 'react'
import { PlayIcon, HeartIcon, InfoIcon } from 'lucide-react'
import { Movie } from '@/types/api.types'
import { useLanguage } from '@/contexts/language.context'
import { useRouter } from 'next/navigation'

interface MovieHeroProps {
  movie: Movie,
}

const MovieHero: React.FC<MovieHeroProps> = ({
  movie
}) => {
  const router = useRouter();

  const handlePlayButtonClick = () => {
    // Handle play button click logic here
    console.log('Play button clicked for movie:', movie.title);
  }

  const handleLikeButtonClick = () => {
    // Handle like button click logic here
    console.log('Like button clicked for movie:', movie.title);
  }

  const handleInfoButtonClick = () => {
    router.push(`/movie/${movie.id}`);
  }

  const { language } = useLanguage();
  return (
    <div className="relative w-full h-[80vh] text-white bg-black flex items-center justify-between overflow-hidden px-16">
      {/* Ảnh nền */}
      {movie.backdrops?.[0]?.url && <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.backdrops?.[0]?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
        }}
      />}

      {/* Nội dung bên trái */}
      <div className="relative z-10 max-w-[40%] pt-[30vh]">
        <div className="relative overflow-hidden" style={{
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}>
          {/* darken background layout - MOVED BEFORE CONTENT */}
          <div className="absolute inset-0 bg-black rounded-lg"
            style={{
              maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
            }}>
          </div>

          {/* content */}
          <div className="space-y-4 relative z-20">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 text-sm mt-4">
              <span className="bg-yellow-400 text-black px-2 py-0.5 rounded">IMDb {movie.vote_average}</span>
              <span className="bg-gray-700 px-2 py-0.5 rounded">{movie.release_date.split('-')[0]}</span>
            </div>

            <div className="flex gap-2 flex-wrap mt-4">
              {movie.genres?.map((genre, index) => (
                <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                  {genre.names.find((n) => n.iso_639_1 === language)?.name || genre.names[0]?.name || 'Unknown'}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-200 leading-relaxed">
                <p>{movie.overview}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 mt-4">
              <button className="cursor-pointer bg-yellow-400 text-black p-4 rounded-full hover:scale-105 transition "
                onClick={handlePlayButtonClick}
              >
                <PlayIcon className="w-6 h-6" />
              </button>
              <button className="cursor-pointer border border-white p-4 rounded-full hover:bg-white hover:text-black transition "
                onClick={handleLikeButtonClick}
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              <button className="cursor-pointer border border-white p-4 rounded-full hover:bg-white hover:text-black transition "
                onClick={handleInfoButtonClick}
              >
                <InfoIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieHero