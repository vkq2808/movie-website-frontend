'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import movieApi from '@/apis/movie.api'
import { Movie, Video, VideoType } from '@/types/api.types'
import MoviePlayer from '@/components/common/MovieWatch/MoviePlayer'
import VideoListSection from '@/components/common/MovieWatch/VideoListSection'

const MovieWatchPage = () => {
  const params = useParams()
  const movieId = params?.id as string

  const [movie, setMovie] = useState<Movie | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!movieId) return
    const fetchMovieData = async () => {
      try {
        setLoading(true)
        const [movieRes, videosRes] = await Promise.all([
          movieApi.getMovieById(movieId),
          movieApi.getMovieVideos(movieId)
        ])

        const movieData = movieRes.data
        const videoData = videosRes.data

        setMovie(movieData)
        setVideos(videoData)

        const mainVideo = videoData.find(v => v.type === VideoType.MOVIE) || null
        setSelectedVideo(mainVideo)
      } catch (err) {
        console.error('[MovieWatchPage] Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [movieId])

  if (loading)
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
