import { Video } from '@/types/api.types'
import VideoThumbnail from './VideoThumbnail'

interface VideoListSectionProps {
  title: string
  videos: Video[]
  selectedVideo: Video | null
  onSelect: (video: Video) => void
}

export default function VideoListSection({
  title,
  videos,
  selectedVideo,
  onSelect
}: VideoListSectionProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-2 uppercase">{title}</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {videos.map(video => (
          <VideoThumbnail
            key={video.id}
            video={video}
            active={selectedVideo?.id === video.id}
            onClick={() => onSelect(video)}
          />
        ))}
      </div>
    </div>
  )
}
