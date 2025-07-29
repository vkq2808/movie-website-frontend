import api from '@/utils/api.util'
import { ApiResponse } from '@/types/api.response'

export interface SearchHistoryEntry {
  id: string
  search_query: string
  searched_at: string
}

/**
 * Save a search query to the user's search history
 * @param searchQuery The search query to save
 * @returns The created search history entry
 */
export async function saveSearchHistory(searchQuery: string): Promise<ApiResponse<SearchHistoryEntry> | null> {
  try {
    const response = await api.post<ApiResponse<SearchHistoryEntry>>(`/search-history`, { search_query: searchQuery })
    return response.data
  } catch (error) {
    console.error('Error saving search history:', error)
    // Fail silently - we don't want to interrupt the user's search experience
    return null
  }
}

/**
 * Get the user's search history
 * @returns Array of search history entries
 */
export async function getSearchHistory(): Promise<ApiResponse<SearchHistoryEntry[]>> {
  try {
    const response = await api.get<ApiResponse<SearchHistoryEntry[]>>(`/search-history`)
    return response.data
  } catch (error) {
    console.error('Error fetching search history:', error)
    throw error
  }
}

/**
 * Delete a search history entry
 * @param id The ID of the search history entry to delete
 * @returns The deleted search history entry
 */
export async function deleteSearchHistory(id: string): Promise<ApiResponse<SearchHistoryEntry>> {
  try {
    const response = await api.delete<ApiResponse<SearchHistoryEntry>>(`/search-history/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting search history:', error)
    throw error
  }
}

/**
 * Clear all search history for the current user
 * @returns Success status
 */
export async function clearSearchHistory(): Promise<ApiResponse<{ cleared: boolean }>> {
  try {
    const response = await api.delete<ApiResponse<{ cleared: boolean }>>(`/search-history/clear`)
    return response.data
  } catch (error) {
    console.error('Error clearing search history:', error)
    throw error
  }
}
