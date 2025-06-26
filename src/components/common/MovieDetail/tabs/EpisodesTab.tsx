'use client'
import React from 'react'
import { Movie } from '@/zustand'

interface EpisodesTabProps {
  movie: Movie
}

const EpisodesTab: React.FC<EpisodesTabProps> = ({ movie }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Tập phim</h2>

      {/* Video Player Section */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-video bg-black flex items-center justify-center">
          {movie.videos && movie.videos.length > 0 ? (
            <div className="text-center">
              <div className="text-6xl text-yellow-400 mb-4">▶</div>
              <p className="text-white text-lg">Nhấn để phát trailer</p>
              <p className="text-gray-400 text-sm mt-2">{movie.videos[0].name}</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl text-gray-600 mb-4">📽</div>
              <p className="text-gray-400">Không có video</p>
            </div>
          )}
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Danh sách tập phim</h3>

        {/* Sample Episode - You can replace this with actual episode data */}
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SUB</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">Phim đầy đủ</h4>
              <p className="text-gray-400 text-sm">Phụ đề tiếng Việt</p>
            </div>
            <div className="text-gray-400 text-sm">
              {movie.duration ? `${movie.duration} phút` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Another episode option */}
        <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DUB</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">Phim đầy đủ (Lồng tiếng)</h4>
              <p className="text-gray-400 text-sm">Lồng tiếng tiếng Việt</p>
            </div>
            <div className="text-gray-400 text-sm">
              {movie.duration ? `${movie.duration} phút` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Movie Info */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">Thông tin phim</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Năm phát hành:</span>
            <span className="text-white ml-2">{movie.release_date?.split('-')[0] || 'N/A'}</span>
          </div>

          <div>
            <span className="text-gray-400">Đánh giá:</span>
            <span className="text-white ml-2">
              {movie.vote_average?.toFixed(1) || '?'}/10 ({movie.vote_count || 0} lượt đánh giá)
            </span>
          </div>

          <div>
            <span className="text-gray-400">Thời lượng:</span>
            <span className="text-white ml-2">{movie.duration ? `${movie.duration} phút` : 'N/A'}</span>
          </div>

          <div>
            <span className="text-gray-400">Thể loại:</span>
            <span className="text-white ml-2">
              {movie.genres?.map(g => g.names?.[0]?.name).join(', ') || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpisodesTab
