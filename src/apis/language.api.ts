import api, { apiEnpoint } from '@/utils/api.util'

export interface Language {
  id: string
  iso_639_1: string
  name: string
  english_name: string
  movie_count?: number
}

export async function getAllLanguages(): Promise<Language[]> {
  try {
    const response = await api.get(`${apiEnpoint.LANGUAGE}`)
    return response.data
  } catch (error) {
    console.error('Error fetching languages:', error)
    throw error
  }
}

export async function getLanguageByIsoCode(isoCode: string): Promise<Language> {
  try {
    const response = await api.get(`${apiEnpoint.LANGUAGE}/${isoCode}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching language with ISO code ${isoCode}:`, error)
    throw error
  }
}

export async function getPopularLanguages(limit: number = 3): Promise<Language[]> {
  try {
    const response = await api.get(`${apiEnpoint.LANGUAGE}/popular`, {
      params: { limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular languages:', error)
    throw error
  }
}
