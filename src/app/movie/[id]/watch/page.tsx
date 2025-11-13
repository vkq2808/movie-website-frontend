'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import movieApi from '@/apis/movie.api'
import { checkMovieOwnership, purchaseMovie } from '@/apis/movie-purchase.api'
import { Movie, Video, VideoType } from '@/types/api.types'
import MoviePlayer from '@/components/common/MovieWatch/MoviePlayer'
import VideoListSection from '@/components/common/MovieWatch/VideoListSection'
import { useAuthStore } from '@/zustand'
import Link from 'next/link'

const MovieWatchPage = () => {
  const params = useParams()
  const movieId = params?.id as string

  const { user } = useAuthStore() // kiểm tra đăng nhập

  const [movie, setMovie] = useState<Movie | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [ownsMovie, setOwnsMovie] = useState<boolean>(false)
  const [checkingOwnership, setCheckingOwnership] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  // Lấy thông tin phim + video
  useEffect(() => {
    if (!movieId) return
    const fetchMovieData = async () => {
      try {
        setLoading(true)
        const [movieRes, videosRes] = await Promise.all([
          movieApi.getMovieById(movieId),
          movieApi.getMovieVideos(movieId)
        ])

        setMovie(movieRes.data)
        setVideos(videosRes.data)

        const mainVideo =
          videosRes.data.find(v => v.type === VideoType.MOVIE) || null
        setSelectedVideo(mainVideo)
      } catch (err) {
        console.error('[MovieWatchPage] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [movieId])

  // Kiểm tra quyền sở hữu phim
  useEffect(() => {
    if (!user || !movieId) {
      setOwnsMovie(false)
      setCheckingOwnership(false)
      return
    }

    const checkOwnership = async () => {
      try {
        setCheckingOwnership(true)
        const res = await checkMovieOwnership(movieId)
        setOwnsMovie(res.data.owns_movie)
      } catch (err) {
        console.error('Ownership check failed', err)
      } finally {
        setCheckingOwnership(false)
      }
    }

    checkOwnership()
  }, [user, movieId])

  // Xử lý mua phim
  const handlePurchase = async () => {
    if (!user) return alert('Vui lòng đăng nhập để mua phim.')
    try {
      setPurchasing(true)
      await purchaseMovie(movieId)
      setOwnsMovie(true)
      alert('Mua phim thành công! Giờ bạn có thể xem phim này.')
    } catch (err) {
      console.error('Purchase failed', err)
      alert('Không thể mua phim. Vui lòng thử lại.')
    } finally {
      setPurchasing(false)
    }
  }

  // ====================== RENDER ======================

  if (loading || checkingOwnership)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Đang tải dữ liệu phim...</p>
      </div>
    )

  if (!movie)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Không tìm thấy thông tin phim.</p>
      </div>
    )

  // Nếu chưa đăng nhập
  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-300">
        <h2 className="text-xl mb-3">Vui lòng đăng nhập để xem phim</h2>
        <Link
          href={`/auth/login?from=${encodeURIComponent(`/movie/${movieId}/watch`)}`}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Đăng nhập
        </Link>
      </div>
    )

  // Nếu chưa mua phim
  if (!ownsMovie)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-300">
        <h2 className="text-xl mb-4">Bạn chưa mua phim này</h2>
        <button
          disabled={purchasing}
          onClick={handlePurchase}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {purchasing ? 'Đang xử lý...' : 'Mua phim để xem'}
        </button>
      </div>
    )

  // Nếu đã mua phim → render player + danh sách video
  const movieVideos = videos.filter(v => v.type === VideoType.MOVIE)
  const trailers = videos.filter(v => v.type === VideoType.TRAILER)
  const clips = videos.filter(v => v.type === VideoType.CLIP)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MoviePlayer movie={movie} video={selectedVideo} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-300 mb-6">{movie.overview}</p>

        <div className="space-y-10">
          {movieVideos.length > 0 && (
            <VideoListSection
              title="Phim chính"
              videos={movieVideos}
              selectedVideo={selectedVideo}
              onSelect={setSelectedVideo}
            />
          )}
          {trailers.length > 0 && (
            <VideoListSection
              title="Trailer & Clip"
              videos={trailers}
              selectedVideo={selectedVideo}
              onSelect={setSelectedVideo}
            />
          )}
          {clips.length > 0 && (
            <VideoListSection
              title="Clip hậu trường"
              videos={clips}
              selectedVideo={selectedVideo}
              onSelect={setSelectedVideo}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieWatchPage
