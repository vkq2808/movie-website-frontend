import { VideoQuality, VideoType } from "@/types/api.types"
import { WatchProviderResponseDto } from "./watch-provider.dto"


export interface VideoResponseDto {
  id: string
  iso_639_1?: string
  iso_3166_1?: string
  name: string
  url: string
  site: string
  type: VideoType
  qualities: {
    url: string;
    quality: VideoQuality;
  }[];
  official: boolean
  thumbnail: string
  duration: number
  created_at: string;
  embed_url: string;
  watch_provider: WatchProviderResponseDto
}
