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
  const response = await api.get<ApiResponse<Language[]>>(`${apiEndpoint.LANGUAGE}`)
  return response.data
}

export async function getLanguageByIsoCode(isoCode: string): Promise<ApiResponse<Language>> {
  const response = await api.get<ApiResponse<Language>>(`${apiEndpoint.LANGUAGE}/${isoCode}`)
  return response.data
}

export async function getPopularLanguages(limit: number = 3): Promise<ApiResponse<Language[]>> {
  const response = await api.get<ApiResponse<Language[]>>(`${apiEndpoint.LANGUAGE}/popular`, {
    params: { limit }
  })
  return response.data
}
