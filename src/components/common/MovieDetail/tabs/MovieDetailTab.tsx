'use client'
import React from 'react'
import { Movie } from '@/zustand'

interface MovieDetailTabProps {
  movie: Movie
}

const MovieDetailTab: React.FC<MovieDetailTabProps> = ({ movie }) => {
  const mainVideo = movie.videos?.[0]

  // Nếu video đến từ TMDB (YouTube)
  const videoUrl =
    mainVideo?.site === 'YouTube'
      ? `https://www.youtube.com/embed/${mainVideo.key}`
      : mainVideo?.site === 'Vimeo'
        ? `https://player.vimeo.com/video/${mainVideo.key}`
        : null

  return (
    <div className="space-y-8">
      {/* --- Title --- */}
      <h2 className="text-2xl font-bold text-white">Thông tin phim</h2>

      {/* --- Trailer Player Section --- */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={mainVideo?.name || 'Trailer'}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="text-center">
              <div className="text-6xl text-gray-600 mb-4">📽</div>
              <p className="text-gray-400">Không có video trailer</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Movie Info --- */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Năm phát hành:</span>
            <span className="text-white ml-2">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-gray-400">Đánh giá:</span>
            <span className="text-white ml-2">
              {movie.vote_average?.toFixed(1) || '?'}
              /10 ({movie.vote_count || 0} lượt)
            </span>
          </div>

          <div>
            <span className="text-gray-400">Thời lượng:</span>
            <span className="text-white ml-2">
              {movie.duration ? `${movie.duration} phút` : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-gray-400">Thể loại:</span>
            <span className="text-white ml-2">
              {movie.genres?.map(g => g.names?.[0]?.name).join(', ') || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* --- Overview --- */}
      {movie.overview && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">Nội dung phim</h3>
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>
      )}

      {/* --- Watch Button --- */}
      <div className="flex justify-center">
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition">
          🎬 Xem phim ngay
        </button>
      </div>
    </div>
  )
}

export default MovieDetailTab
