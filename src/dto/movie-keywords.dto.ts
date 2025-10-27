export interface MovieKeywordItemDto {
  id: string
  name: string
  description?: string
}

export interface MovieKeywordsResponseDto {
  movie_id: string
  keywords: MovieKeywordItemDto[]
}

export default MovieKeywordsResponseDto
