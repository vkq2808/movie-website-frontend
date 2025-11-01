import { Play } from 'lucide-react'
import { Video } from '@/types/api.types'

interface VideoThumbnailProps {
  video: Video
  active?: boolean
  onClick?: () => void
}

export default function VideoThumbnail({ video, active, onClick }: VideoThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 group rounded overflow-hidden ${active ? 'ring-2 ring-red-600' : ''
        }`}
    >
      <img
        src={video.thumbnail}
        alt={video.name}
        className="w-48 h-28 object-cover"
      />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <Play className="w-8 h-8 text-white" fill="white" />
      </div>
      <p className="absolute bottom-2 left-2 text-xs bg-black/80 px-2 py-1 rounded">
        {video.type}
      </p>
    </button>
  )
}
