'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Movie } from '@/types/api.types'
import Script from 'next/script'
import movieApi from '@/apis/movie.api'
import type { VideoResponseDto } from '@/dto/movie-video.dto'
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string | HTMLElement, options: any) => YTPlayer; // eslint-disable-line @typescript-eslint/no-explicit-any
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MovieDetailTabProps {
  movie: Movie
}

type YTPlayer = {
  destroy(): void
  playVideo(): void
  pauseVideo(): void
}

interface YTPlayerOptions {
  videoId: string
  playerVars?: {
    controls?: 0 | 1
    modestbranding?: 0 | 1
    rel?: 0 | 1
  }
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
    onError?: (event: { target: YTPlayer; data: number }) => void
    onStateChange?: (event: { target: YTPlayer; data: number }) => void
  }
}

const MovieDetailTab: React.FC<MovieDetailTabProps> = ({ movie }) => {
  const [videos, setVideos] = useState<VideoResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoError, setIsVideoError] = useState(false)
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [mainVideo, setMainVideo] = useState<VideoResponseDto | null>(null)

  // Khi API YouTube sẵn sàng
  useEffect(() => {
    if (window.YT?.Player) {
      setIsYouTubeApiReady(true)
    } else {
      const originalCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        setIsYouTubeApiReady(true)
        if (originalCallback) originalCallback()
      }
    }
  }, [])

  // Lấy danh sách video
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true)
        const response = await movieApi.getMovieVideos(movie.id)
        if (response.success && response.data) {
          setVideos(response.data)
          setMainVideo(response.data.find(v => v.type === 'Trailer') || response.data[0] || null)
        } else {
          setIsVideoError(true)
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        setIsVideoError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (movie.id) fetchVideos()
  }, [movie.id])

  // Khởi tạo YouTube player khi có API và video
  useEffect(() => {
    if (isYouTubeApiReady && mainVideo?.site === 'YouTube' && !isVideoError) {
      initializeYouTubePlayer()
    }
  }, [isYouTubeApiReady, mainVideo, isVideoError])

  // Khởi tạo player
  const initializeYouTubePlayer = () => {
    if (!isYouTubeApiReady || !mainVideo?.url || !playerContainerRef.current) return

    // Trích videoId từ URL embed YouTube
    const videoId = extractYouTubeId(mainVideo.url)
    if (!videoId) {
      console.warn('Không thể trích xuất videoId từ URL:', mainVideo.url)
      return
    }

    try {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => console.log('YouTube player ready'),
          onError: (error) => {
            console.error('YouTube player error:', error)
            setIsVideoError(true)
          },
          onStateChange: (event) => console.log('YouTube player state changed:', event.data)
        }
      })
    } catch (error) {
      console.error('Error initializing YouTube player:', error)
      setIsVideoError(true)
    }
  }

  // Hàm tách videoId từ URL
  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  // URL Vimeo
  const vimeoUrl = mainVideo?.site === 'Vimeo' ? mainVideo.url : null
  const dailymotionUrl = mainVideo?.site === 'Dailymotion' ? mainVideo.url : null

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Thông tin phim</h2>

      {/* --- Trailer --- */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="aspect-video bg-black flex items-center justify-center relative">

          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-gray-400 mt-4">Đang tải video...</p>
            </div>
          ) : mainVideo?.site === 'YouTube' && !isVideoError ? (
            <>
              <Script
                src="https://www.youtube.com/iframe_api"
                strategy="lazyOnload"
                async
                onReady={() => {
                  window.onYouTubeIframeAPIReady = () => {
                    if (window.YT?.Player) initializeYouTubePlayer()
                  }
                  if (window.YT?.Player) initializeYouTubePlayer()
                }}
              />
              <div ref={playerContainerRef} className="w-full h-full" />
            </>
          ) : vimeoUrl ? (
            <iframe
              src={vimeoUrl}
              title={mainVideo?.name || 'Trailer'}
              allowFullScreen
              className="w-full h-full"
            />
          ) : dailymotionUrl ? (
            <iframe
              src={dailymotionUrl}
              title={mainVideo?.name || 'Trailer'}
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl text-gray-600 mb-4">📽</div>
              <p className="text-gray-400">
                {isVideoError ? 'Không thể tải video trailer' : 'Không có video trailer'}
              </p>
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
