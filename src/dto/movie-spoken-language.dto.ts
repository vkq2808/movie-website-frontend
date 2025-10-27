export interface MovieSpokenLanguageItemDto {
  id: string
  name: string
  iso_639_1: string;
}

export interface MovieSpokenLanguagesResponseDto {
  movie_id: string
  spoken_languages: MovieSpokenLanguageItemDto[]
}

export default MovieSpokenLanguagesResponseDto
