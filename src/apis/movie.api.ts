import { CreateMovieDto, UpdateMovieDto } from '@/dto/movie.dto'
import api, { apiEndpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response'

// Import the types from alternative-title.api.ts to reuse them
import { AlternativeTitle, UpdateAlternativeTitlesResponse, ImportAlternativeTitlesResponse } from './alternative-title.api'
import type {
  MovieProductionCompanyResponseDto,
  MovieCrewResponseDto,
  MovieCastResponseDto,
  MovieKeywordsResponseDto,
  MovieSpokenLanguagesResponseDto,
} from '@/dto'
import { VideoResponseDto } from '@/dto/movie-video.dto'

// Response type for language operations
export interface LanguageOperationResponse {
  message: string;
  movie: Movie;
}

// Production company response DTO returned by backend
// production company and crew DTOs moved to src/dto/

export async function getTop5Movies(): Promise<ApiResponse<Movie[]>> {
  const response = await api.get<ApiResponse<Movie[]>>(`${apiEndpoint.MOVIE}/slides`)
  return response.data
}

export async function getMovieById(id: string): Promise<ApiResponse<Movie>> {
  const response = await api.get<ApiResponse<Movie>>(`${apiEndpoint.MOVIE}/${id}`)
  return response.data
}

export async function getMovieVideos(id: string): Promise<ApiResponse<VideoResponseDto[]>> {
  const response = await api.get<ApiResponse<VideoResponseDto[]>>(`${apiEndpoint.MOVIE}/${id}/videos`)
  return response.data
}

export async function getMovieGenres(id: string): Promise<ApiResponse<Movie['genres']>> {
  const response = await api.get<ApiResponse<Movie['genres']>>(`${apiEndpoint.MOVIE}/${id}/genres`)
  return response.data
}

export async function getMovieCast(id: string): Promise<ApiResponse<MovieCastResponseDto>> {
  const response = await api.get<ApiResponse<MovieCastResponseDto>>(`${apiEndpoint.MOVIE}/${id}/cast`)
  return response.data
}

export async function getMovieCrew(id: string): Promise<ApiResponse<MovieCrewResponseDto>> {
  const response = await api.get<ApiResponse<MovieCrewResponseDto>>(`${apiEndpoint.MOVIE}/${id}/crew`)
  return response.data
}

export async function getMovieProductionCompanies(id: string): Promise<ApiResponse<MovieProductionCompanyResponseDto[]>> {
  const response = await api.get<ApiResponse<MovieProductionCompanyResponseDto[]>>(`${apiEndpoint.MOVIE}/${id}/production-companies`)
  return response.data
}

export async function getMovieKeywords(id: string): Promise<ApiResponse<MovieKeywordsResponseDto>> {
  const response = await api.get<ApiResponse<MovieKeywordsResponseDto>>(`${apiEndpoint.MOVIE}/${id}/keywords`)
  return response.data
}

export async function getMovieSpokenLanguages(id: string): Promise<ApiResponse<MovieSpokenLanguagesResponseDto>> {
  const response = await api.get<ApiResponse<MovieSpokenLanguagesResponseDto>>(`${apiEndpoint.MOVIE}/${id}/spoken-languages`)
  return response.data
}

// Generic movies listing with optional filters and pagination
export async function getMovies(params?: {
  page?: number;
  limit?: number;
  title?: string;
  status?: string;
  genres?: string; // comma-separated IDs
  original_language?: string;
  sort_by?: 'popularity' | 'release_date' | 'vote_average' | 'title' | 'vote_count';
  sort_order?: 'ASC' | 'DESC';
}): Promise<PaginatedApiResponse<Movie>> {
  const response = await api.get<PaginatedApiResponse<Movie>>(`${apiEndpoint.MOVIE}`, {
    params: params ?? {}
  })
  return response.data
}

export async function getMoviePoster(movieId: string) {
  const response = await api.get<ApiResponse<{ poster_url: string }>>(
    `${apiEndpoint.MOVIE}/${movieId}/poster`
  );
  return response.data;
}

export async function getMovieAlternativeTitles(movieId: string): Promise<ApiResponse<AlternativeTitle[]>> {
  const response = await api.get<ApiResponse<AlternativeTitle[]>>(
    `${apiEndpoint.MOVIE}/${movieId}/alternative-titles`
  )
  return response.data
}

export async function updateMovieAlternativeTitles(movieId: string): Promise<ApiResponse<UpdateAlternativeTitlesResponse>> {
  const response = await api.post<ApiResponse<UpdateAlternativeTitlesResponse>>(
    `${apiEndpoint.MOVIE}/${movieId}/update-alternative-titles`
  )
  return response.data
}

export async function importMovieAlternativeTitles(movieId: string, tmdbId: number): Promise<ApiResponse<ImportAlternativeTitlesResponse>> {
  const response = await api.post<ApiResponse<ImportAlternativeTitlesResponse>>(
    `${apiEndpoint.MOVIE}/${movieId}/import-alternative-titles`,
    { tmdbId }
  )
  return response.data
}

export async function createMovie(movieData: CreateMovieDto): Promise<ApiResponse<Movie>> {
  const response = await api.post<ApiResponse<Movie>>(`${apiEndpoint.MOVIE}`, movieData)
  return response.data
}

export async function updateMovie(movieId: string, movieData: UpdateMovieDto): Promise<ApiResponse<Movie>> {
  const response = await api.post<ApiResponse<Movie>>(`${apiEndpoint.MOVIE}/${movieId}`, movieData)
  return response.data
}

export async function addLanguageToMovie(movieId: string, languageIsoCode: string): Promise<ApiResponse<Movie>> {
  const response = await api.post<ApiResponse<Movie>>(
    `${apiEndpoint.MOVIE}/${movieId}/languages/add`,
    {
      languageIsoCode,
    }
  )
  return response.data
}

export async function removeLanguageFromMovie(movieId: string, languageIsoCode: string): Promise<ApiResponse<Movie>> {
  const response = await api.post<ApiResponse<Movie>>(
    `${apiEndpoint.MOVIE}/${movieId}/languages/remove`,
    {
      languageIsoCode,
    }
  )
  return response.data
}

export async function getMoviesByLanguage(country: string, iso_639_1: string, page: number = 1, limit: number = 10): Promise<PaginatedApiResponse<Movie>> {
  const response = await api.get<PaginatedApiResponse<Movie>>(`${apiEndpoint.MOVIE}`, {
    params: {
      page,
      limit,
      production_company: country,
      spoken_language: iso_639_1,
    }
  })
  return response.data
}