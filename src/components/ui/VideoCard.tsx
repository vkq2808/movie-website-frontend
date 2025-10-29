import { AdminVideo } from "@/apis/admin.api";
import Image from "next/image";



export default function VideoCard({ video, width = 160, height = 90 }: { video: AdminVideo, width?: number, height?: number }) {
  // Hỗ trợ nhúng YouTube & Vimeo
  const embedUrl =
    video.site === "YouTube"
      ? `https://www.youtube.com/embed/${video.key}`
      : video.site === "Vimeo"
        ? `https://player.vimeo.com/video/${video.key}`
        : null;

  return (
    <div className="rounded border border-gray-800 bg-gray-900/50 p-2">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={video.name || video.key}
          allowFullScreen
          className="aspect-video w-full rounded"
        ></iframe>
      ) : (
        <Image
          alt="Missing Preview"
          className="cursor-pointer"
          src={video.thumbnail}
          width={width}
          height={height}
          onClick={() => window.open(video.thumbnail, '_self')}
        />
      )}

      <div className="mt-2 text-sm font-medium text-white">{video.name || "Unnamed video"}</div>
      <div className="text-xs text-gray-400 flex justify-between">
        <span>{video.type}</span>
        {video.official && <span className="text-green-400">Official</span>}
      </div>
    </div>
  );
}
