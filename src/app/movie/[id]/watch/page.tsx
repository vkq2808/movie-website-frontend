'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import movieApi from '@/apis/movie.api'
import { checkMovieOwnership, purchaseMovie, canWatchMovie } from '@/apis/movie-purchase.api'
import { Movie, Video, VideoType } from '@/types/api.types'
import MoviePlayer from '@/components/common/MovieWatch/MoviePlayer'
import VideoListSection from '@/components/common/MovieWatch/VideoListSection'
import { useAuthStore } from '@/zustand'
import Link from 'next/link'

const MovieWatchPage = () => {
  const params = useParams()
  const movieId = params?.id as string

  const { user } = useAuthStore()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const [loadingUser, setLoadingUser] = useState(true)
  const [checkingPermission, setCheckingPermission] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [canWatch, setCanWatch] = useState<boolean>(false)
  const [purchasing, setPurchasing] = useState(false)


  useEffect(() => {
    if (user !== undefined) {
      setLoadingUser(false)
    }
  }, [user])

  useEffect(() => {
    if (loadingUser || !movieId) return

    const checkPermission = async () => {
      try {
        setCheckingPermission(true)

        const res = await canWatchMovie(movieId)
        setCanWatch(res.data.canWatch)
      } catch (err) {
        console.error('[MovieWatchPage] Permission check failed:', err)
        setCanWatch(false)
      } finally {
        setCheckingPermission(false)
      }
    }

    checkPermission()
  }, [loadingUser, movieId])



  useEffect(() => {
    if (loadingUser || checkingPermission || !movieId || !canWatch) {

      if (!loadingUser && !checkingPermission && !canWatch) {
        setVideos([])
        setSelectedVideo(null)
      }
      return
    }

    const fetchMovieAndVideos = async () => {
      try {
        setLoadingVideo(true)
        const [movieRes, videosRes] = await Promise.all([
          movieApi.getMovieById(movieId),
          movieApi.getMovieVideos(movieId),
        ])

        setMovie(movieRes.data)
        setVideos(videosRes.data)

        const mainVideo =
          videosRes.data.find((v) => v.type === VideoType.MOVIE) || null
        setSelectedVideo(mainVideo)
      } catch (err) {
        console.error('[MovieWatchPage] Fetch error:', err)
      } finally {
        setLoadingVideo(false)
      }
    }

    fetchMovieAndVideos()
  }, [canWatch, movieId, loadingUser, checkingPermission])


  useEffect(() => {
    if (loadingUser || !movieId) return

    const fetchMovieInfo = async () => {
      try {
        const movieRes = await movieApi.getMovieById(movieId)
        setMovie(movieRes.data)
      } catch (err) {
        console.error('[MovieWatchPage] Movie fetch error:', err)
      }
    }

    fetchMovieInfo()
  }, [movieId, loadingUser])


  const handlePurchase = async () => {
    if (!user) return alert('Vui lòng đăng nhập để mua phim.')
    try {
      setPurchasing(true)
      await purchaseMovie(movieId)

      const res = await canWatchMovie(movieId)
      setCanWatch(res.data.canWatch)
      alert('Mua phim thành công! Giờ bạn có thể xem phim này.')
    } catch (err) {
      console.error('Purchase failed', err)
      alert('Không thể mua phim. Vui lòng thử lại.')
    } finally {
      setPurchasing(false)
    }
  }

  if (loadingUser)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Đang kiểm tra trạng thái đăng nhập...</p>
      </div>
    )

  if (!movie)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Đang lấy thông tin phim.</p>
      </div>
    )


  if (checkingPermission)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    ) 


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


  if (!canWatch)
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


  if (loadingVideo)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Đang tải danh sách video...</p>
      </div>
    )


  const movieVideos = videos.filter((v) => v.type === VideoType.MOVIE)
  const trailers = videos.filter((v) => v.type === VideoType.TRAILER)
  const clips = videos.filter((v) => v.type === VideoType.CLIP)

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
