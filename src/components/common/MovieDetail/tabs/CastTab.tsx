'use client'
import React from 'react'
import { Movie, MovieCast as MovieCastType, Person as PersonType } from '@/zustand'
import Image from 'next/image'

interface CastTabProps {
  movie: Movie
}

const CastTab: React.FC<CastTabProps> = ({ movie }) => {
  const cast = movie.cast;

  React.useEffect(() => {
    console.log('Movie:', movie);
  }, [movie]);

  if (cast && cast.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Diễn viên</h2>
        <p className="text-gray-400">Không có thông tin diễn viên</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Diễn viên</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast?.map((c) => {
          const person: PersonType | undefined = c.person as PersonType | undefined
          const name = person?.name || 'Unknown'
          const profile = person?.profile_image?.url || ''
          const character = c.character || ''
          return (
            <div key={c.id} className="bg-gray-800 rounded-lg p-3 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3">
                {profile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile as string} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">{name?.charAt(0)}</div>
                )}
              </div>
              <div className="text-white font-medium">{name}</div>
              <div className="text-gray-400 text-sm mt-1">{character}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CastTab
