import { CreateMovieDto, UpdateMovieDto } from '@/dto/movie.dto'
import api, { apiEndpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'
import { ApiResponse, PaginatedApiResponse } from '@/types/api.response'

export async function getTop5Movies(): Promise<ApiResponse<Movie[]>> {
  const response = await api.get<ApiResponse<Movie[]>>(`${apiEndpoint.MOVIE}/slides`)
  return response.data
}

export async function getMovieById(id: string): Promise<ApiResponse<Movie>> {
  const response = await api.get<ApiResponse<Movie>>(`${apiEndpoint.MOVIE}/${id}`)
  return response.data
}

export async function getMovieAlternativeTitles(movieId: string): Promise<ApiResponse<any>> {
  const response = await api.get<ApiResponse<any>>(
    `${apiEndpoint.MOVIE}/${movieId}/alternative-titles`
  )
  return response.data
}

export async function updateMovieAlternativeTitles(movieId: string): Promise<ApiResponse<any>> {
  const response = await api.post<ApiResponse<any>>(
    `${apiEndpoint.MOVIE}/${movieId}/update-alternative-titles`
  )
  return response.data
}

export async function importMovieAlternativeTitles(movieId: string, tmdbId: number): Promise<ApiResponse<any>> {
  const response = await api.post<ApiResponse<any>>(
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

export async function addLanguageToMovie(movieId: string, languageIsoCode: string): Promise<ApiResponse<any>> {
  const response = await api.post<ApiResponse<any>>(
    `${apiEndpoint.MOVIE}/${movieId}/languages/add`,
    {
      languageIsoCode,
    }
  )
  return response.data
}

export async function removeLanguageFromMovie(movieId: string, languageIsoCode: string): Promise<ApiResponse<any>> {
  const response = await api.post<ApiResponse<any>>(
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