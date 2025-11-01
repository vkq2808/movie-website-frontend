import { Play, Film } from 'lucide-react'
import { Movie, Video, VideoQuality } from '@/types/api.types'
import VideoPlayer from '@/components/ui/VideoPlayer'

interface MoviePlayerProps {
  movie: Movie
  video: Video | null
  quality?: VideoQuality;
}

export default function MoviePlayer({ movie, video }: MoviePlayerProps) {
  const backdropUrl =
    movie.backdrops?.[0]?.url ||
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop'
  const resolutions = video?.qualities?.map(q => q.quality as string) ?? [];

  return (
    <div className="relative w-full bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
          {video ?
            <VideoPlayer
              resolutions={resolutions}
              videoSrc={video.url}
            />
            : (
              <div className="relative w-full h-full">
                <img
                  src={backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Film className="w-16 h-16 text-gray-500" />
                  <p className="text-gray-300 text-lg font-semibold">
                    🎬 Phim chưa được phát hành
                  </p>
                  <p className="text-gray-500 text-sm">
                    Hiện chưa có video Movie chính thức nào được đăng tải.
                  </p>
                </div>
              </div>
            )}

          {video && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <p className="text-sm text-gray-300 mb-1">{video.type}</p>
              <p className="font-semibold">{video.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
