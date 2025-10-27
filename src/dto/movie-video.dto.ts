export type VideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Featurette'
  | 'Behind the Scenes'
  | 'Other'

export type VideoQuality = 'low' | 'medium' | 'high' | '720' | '1080' | '4k'

export interface VideoResponseDto {
  id: string
  iso_639_1?: string
  iso_3166_1?: string
  name?: string
  key: string
  site: string
  size?: number
  type: VideoType
  quality: VideoQuality
  official: boolean
  embed_url: string
  thumbnail_url: string
}
