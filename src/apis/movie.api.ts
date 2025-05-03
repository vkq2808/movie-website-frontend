import api, { apiEnpoint } from '@/utils/api.util'
import { Movie } from '@/zustand'

export async function getTop5Movies(): Promise<Movie[]> {
  const response = await api.get<Movie[]>(`${apiEnpoint.MOVIE}/slides`)
  if (response.status !== 200) {
    throw new Error('Failed to fetch movies')
  }
  return response.data
}