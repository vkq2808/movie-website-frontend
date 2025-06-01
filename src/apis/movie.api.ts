import api, { apiEnpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'

export async function getTop5Movies(): Promise<Movie[]> {
  const response = await api.get<Movie[]>(`${apiEnpoint.MOVIE}/slides`)
  if (response.status !== 200) {
    throw new Error('Failed to fetch movies')
  }
  return response.data
}

export async function getMovieById(id: string) {
  const response = await api.get(`${apiEnpoint.MOVIE}/${id}`)
  if (response.status !== 200) {
    throw new Error('Failed to fetch movie details')
  }
  return response.data
}

export async function getMovieAlternativeTitles(movieId: string) {
  try {
    const response = await api.get(
      `${apiEnpoint.MOVIE}/${movieId}/alternative-titles`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching alternative titles:', error)
    throw error
  }
}

export async function updateMovieAlternativeTitles(movieId: string) {
  try {
    const response = await api.post(
      `${apiEnpoint.MOVIE}/${movieId}/update-alternative-titles`
    )
    return response.data
  } catch (error) {
    console.error('Error updating alternative titles:', error)
    throw error
  }
}

export async function importMovieAlternativeTitles(movieId: string, tmdbId: number) {
  try {
    const response = await api.post(
      `${apiEnpoint.MOVIE}/${movieId}/import-alternative-titles`,
      { tmdbId }
    )
    return response.data
  } catch (error) {
    console.error('Error importing alternative titles:', error)
    throw error
  }
}

export async function createMovie(movieData: any) {
  try {
    const response = await api.post(`${apiEnpoint.MOVIE}`, movieData)
    return response.data
  } catch (error) {
    console.error('Error creating movie:', error)
    throw error
  }
}

export async function updateMovie(movieId: string, movieData: any) {
  try {
    const response = await api.post(`${apiEnpoint.MOVIE}/${movieId}`, movieData)
    return response.data
  } catch (error) {
    console.error('Error updating movie:', error)
    throw error
  }
}

export async function addLanguageToMovie(movieId: string, languageIsoCode: string) {
  try {
    const response = await api.post(
      `${apiEnpoint.MOVIE}/${movieId}/languages/add`,
      {
        languageIsoCode,
      }
    )
    return response.data
  } catch (error) {
    console.error('Error adding language to movie:', error)
    throw error
  }
}

export async function removeLanguageFromMovie(movieId: string, languageIsoCode: string) {
  try {
    const response = await api.post(
      `${apiEnpoint.MOVIE}/${movieId}/languages/remove`,
      {
        languageIsoCode,
      }
    )
    return response.data
  } catch (error) {
    console.error('Error removing language from movie:', error)
    throw error
  }
}

export async function getMoviesByLanguage(languageIsoCode: string, page: number = 1, limit: number = 10) {
  try {
    const response = await api.get(`${apiEnpoint.MOVIE}`, {
      params: {
        page,
        limit,
        language: languageIsoCode
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching movies by language:', error)
    throw error
  }
}