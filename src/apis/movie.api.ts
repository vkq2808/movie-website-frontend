import { CreateMovieDto, UpdateMovieDto } from '@/dto/movie.dto'
import api, { apiEndpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response'

// Import the types from alternative-title.api.ts to reuse them
import { AlternativeTitle, UpdateAlternativeTitlesResponse, ImportAlternativeTitlesResponse } from './alternative-title.api'

// Response type for language operations
export interface LanguageOperationResponse {
  message: string;
  movie: Movie;
}

export async function getTop5Movies(): Promise<ApiResponse<Movie[]>> {
  const response = await api.get<ApiResponse<Movie[]>>(`${apiEndpoint.MOVIE}/slides`)
  return response.data
}

export async function getMovieById(id: string): Promise<ApiResponse<Movie>> {
  const response = await api.get<ApiResponse<Movie>>(`${apiEndpoint.MOVIE}/${id}`)
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

export async function getMoviesByLanguage(languageIsoCode: string, page: number = 1, limit: number = 10): Promise<PaginatedApiResponse<Movie>> {
  const response = await api.get<PaginatedApiResponse<Movie>>(`${apiEndpoint.MOVIE}`, {
    params: {
      page,
      limit,
      language: languageIsoCode
    }
  })
  return response.data
}