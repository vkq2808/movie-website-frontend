import api, { apiEndpoint } from '@/utils/api.util'
import { ApiResponse } from '@/types/api.response'

export interface Language {
  id: string
  iso_639_1: string
  name: string
  english_name: string
  movie_count?: number
}

export async function getAllLanguages(): Promise<ApiResponse<Language[]>> {
  try {
    const response = await api.get<ApiResponse<Language[]>>(`${apiEndpoint.LANGUAGE}`)
    return response.data
  } catch (error) {
    console.error('Error fetching languages:', error)
    throw error
  }
}

export async function getLanguageByIsoCode(isoCode: string): Promise<ApiResponse<Language>> {
  try {
    const response = await api.get<ApiResponse<Language>>(`${apiEndpoint.LANGUAGE}/${isoCode}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching language with ISO code ${isoCode}:`, error)
    throw error
  }
}

export async function getPopularLanguages(limit: number = 3): Promise<ApiResponse<Language[]>> {
  try {
    const response = await api.get<ApiResponse<Language[]>>(`${apiEndpoint.LANGUAGE}/popular`, {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular languages:', error)
    throw error
  }
}
