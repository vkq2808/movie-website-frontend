import api, { apiEndpoint } from '@/utils/api.util'

/**
 * Save a search query to the user's search history
 * @param searchQuery The search query to save
 * @returns The created search history entry
 */
export async function saveSearchHistory(searchQuery: string) {
  try {
    const response = await api.post(`/search-history`, { search_query: searchQuery })
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
export async function getSearchHistory() {
  try {
    const response = await api.get(`/search-history`)
    return response.data
  } catch (error) {
    console.error('Error fetching search history:', error)
    return []
  }
}

/**
 * Delete a search history entry
 * @param id The ID of the search history entry to delete
 * @returns The deleted search history entry
 */
export async function deleteSearchHistory(id: string) {
  try {
    const response = await api.delete(`/search-history/${id}`)
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
export async function clearSearchHistory() {
  try {
    const response = await api.delete(`/search-history/clear`)
    return response.data
  } catch (error) {
    console.error('Error clearing search history:', error)
    throw error
  }
}
