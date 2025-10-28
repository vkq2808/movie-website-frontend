export enum VideoType {
  TRAILER = "Trailer",
  CLIP = "Clip",
  MOVIE = "Movie",
  FEATURETTE = "Featurette",
  OTHER = "Other"
}

export enum VideoQuality {
  LOW = '480p',
  MEDIUM = '720p',
  HD = '1080p'
}


export interface VideoResponseDto {
  id: string
  iso_639_1?: string
  iso_3166_1?: string
  name?: string
  key: string
  site: string
  type: VideoType
  quality: VideoQuality
  official: boolean
  preview_url: string
  duration: number
  created_at: string;
}