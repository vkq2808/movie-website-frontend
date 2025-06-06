'use client'
import React from 'react'
import { Movie } from '@/zustand'

interface CastTabProps {
  movie: Movie
}

const CastTab: React.FC<CastTabProps> = ({ movie }) => {
  // Demo cast data - replace with actual cast data from your API
  const democast = [
    {
      id: '1',
      name: 'Main Actor 1',
      character: 'Lead Role',
      profileImage: null,
    },
    {
      id: '2',
      name: 'Main Actor 2',
      character: 'Supporting Role',
      profileImage: null,
    },
    {
      id: '3',
      name: 'Main Actor 3',
      character: 'Villain',
      profileImage: null,
    },
    {
      id: '4',
      name: 'Main Actor 4',
      character: 'Love Interest',
      profileImage: null,
    },
  ]

  const demoCrew = [
    {
      id: '1',
      name: 'Director Name',
      job: 'Director',
      profileImage: null,
    },
    {
      id: '2',
      name: 'Producer Name',
      job: 'Producer',
      profileImage: null,
    },
    {
      id: '3',
      name: 'Writer Name',
      job: 'Screenplay',
      profileImage: null,
    },
    {
      id: '4',
      name: 'Composer Name',
      job: 'Music',
      profileImage: null,
    },
  ]

  const CastMemberCard = ({ person, role }: { person: any, role: string }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
      <div className="aspect-[3/4] bg-gray-700">
        {person.profileImage ? (
          <img
            src={person.profileImage}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-600">
            <div className="text-4xl text-gray-400">👤</div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium text-sm mb-1 truncate">{person.name}</h3>
        <p className="text-gray-400 text-xs truncate">{role}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Cast Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Diễn viên</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {democast.map((actor) => (
            <CastMemberCard
              key={actor.id}
              person={actor}
              role={actor.character}
            />
          ))}
        </div>
      </div>

      {/* Crew Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Đoàn làm phim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {demoCrew.map((crewMember) => (
            <CastMemberCard
              key={crewMember.id}
              person={crewMember}
              role={crewMember.job}
            />
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Thông tin sản xuất</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Đạo diễn</h4>
            <p className="text-gray-400">Director Name</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Nhà sản xuất</h4>
            <p className="text-gray-400">Producer Name</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Biên kịch</h4>
            <p className="text-gray-400">Writer Name</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Nhạc nền</h4>
            <p className="text-gray-400">Composer Name</p>
          </div>
        </div>
      </div>

      {/* Character Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Chi tiết nhân vật</h3>
        {democast.slice(0, 3).map((actor) => (
          <div key={actor.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex gap-4">
              <div className="w-16 h-20 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                <div className="text-2xl text-gray-400">👤</div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{actor.name}</h4>
                <p className="text-yellow-400 text-sm mb-2">vai {actor.character}</p>
                <p className="text-gray-400 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CastTab
