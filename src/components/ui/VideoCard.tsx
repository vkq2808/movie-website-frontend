import { AdminVideo } from "@/apis/admin.api";
import Image from "next/image";



export default function VideoCard({ video, width = 284, height = 160 }: { video: AdminVideo, width?: number, height?: number }) {
  // Hỗ trợ nhúng YouTube & Vimeo
  const embedUrl = video?.site?.toLowerCase() in ['youtube', 'vimeo', 'dailymotion'] ? video.url : null;

  return (
    <div className="rounded border border-gray-800 bg-gray-900/50 p-2">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={video?.name}
          allowFullScreen
          className="aspect-video w-full rounded"
        ></iframe>
      ) : (
        <Image
          alt="Missing Preview"
          className="cursor-pointer"
          src={video?.thumbnail}
          width={width}
          height={height}
          onClick={() => window.open(video.thumbnail, '_self')}
        />
      )}

      <div className="mt-2 text-sm font-medium text-white">{video?.name || "Unnamed video"}</div>
      <div className="text-xs text-gray-400 flex justify-between">
        <span>{video.type}</span>
        {video.official && <span className="text-green-400">Official</span>}
      </div>
    </div>
  );
}
