'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { RecommendationResponse, getRecommendations, getTrendingRecommendations, RecommendationFilters } from '@/apis/recommendation.api'
import MovieCard from './MovieCard/MovieCard'
import LoadingSpinner from './LoadingSpinner'
import { ChevronLeft, ChevronRight, RefreshCw, Filter } from 'lucide-react'
import { isAuthError } from '@/utils/auth.util'

interface RecommendationSectionProps {
  title?: string
  type?: 'content_based' | 'collaborative' | 'hybrid' | 'trending'
  limit?: number
  showFilters?: boolean
  showRefresh?: boolean
  className?: string
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title = 'Recommended for You',
  type = 'hybrid',
  limit = 18,
  showFilters = false,
  showRefresh = true,
  className = '',
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationResponse[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [filters, setFilters] = useState<RecommendationFilters>({
    type,
    limit,
    page: 1,
    exclude_watched: true,
  })

  const fetchTrendingMovies = useCallback(async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page

    try {
      const response = await getTrendingRecommendations({
        limit: filters.limit,
        page: currentPage,
        exclude_watched: filters.exclude_watched,
        exclude_purchased: filters.exclude_purchased,
        min_score: filters.min_score,
      });

      if (response.success) {
        const trendingMovies = response.data.recommendations

        if (resetPage) {
          setRecommendations(trendingMovies)
          setPage(1)
        } else {
          setRecommendations(prev => [...prev, ...trendingMovies])
        }

        setHasMore(response.data.hasMore)
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error; // Re-throw to handle in main function
    }
  }, [filters, page])

  const fetchRecommendations = useCallback(async (resetPage = false) => {
    try {
      setLoading(!resetPage && recommendations.length === 0)
      setError(null)

      const currentPage = resetPage ? 1 : page

      // For trending type, directly call trending endpoint
      if (filters.type === 'trending') {
        const success = await fetchTrendingMovies(resetPage);
        if (!success) {
          setError('Failed to load trending movies')
        }
        return;
      }

      // First, try to get personalized recommendations
      try {
        const response = await getRecommendations({
          ...filters,
          page: currentPage,
        })

        if (response.success) {
          const newRecommendations = response.data.recommendations

          if (resetPage) {
            setRecommendations(newRecommendations)
            setPage(1)
          } else {
            setRecommendations(prev => [...prev, ...newRecommendations])
          }

          setHasMore(response.data.hasMore)
        } else {
          setError('Failed to load recommendations')
        }
      } catch (error: unknown) {
        // Handle authentication errors gracefully - fetch trending instead
        if (isAuthError(error)) {
          console.log('User not authenticated, falling back to trending movies')
          try {
            const success = await fetchTrendingMovies(resetPage);
            if (!success) {
              setError('Failed to load movies')
            }
          } catch (trendingError) {
            console.error('Error fetching trending movies:', trendingError)
            setError('Failed to load movies')
          }
        } else {
          console.error('Error fetching recommendations:', error)
          setError('Failed to load recommendations')
        }
      }
    } catch (error: unknown) {
      console.error('Unexpected error in fetchRecommendations:', error)
      setError('Failed to load movies')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters, fetchTrendingMovies])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRecommendations(true)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const getRecommendationTypeDisplay = (recType: string) => {
    switch (recType) {
      case 'content_based':
        return 'Based on your preferences'
      case 'collaborative':
        return 'Users like you also enjoyed'
      case 'hybrid':
        return 'Personalized for you'
      case 'trending':
        return 'Trending now'
      default:
        return 'Recommended'
    }
  }

  const getRecommendationIcon = (recType: string) => {
    switch (recType) {
      case 'content_based':
        return '🎯'
      case 'collaborative':
        return '👥'
      case 'hybrid':
        return '✨'
      case 'trending':
        return '🔥'
      default:
        return '🎬'
    }
  }

  // Khi filters thay đổi (ví dụ user đổi loại recommendation)
  useEffect(() => {
    fetchRecommendations(true)
  }, [filters]) // Chỉ chạy khi filters đổi

  // Khi page tăng (Load More)
  useEffect(() => {
    if (page > 1) fetchRecommendations(false)
  }, [page])


  if (loading && recommendations.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-400 mt-4">Loading recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-12">
          <div className="bg-gray-800/50 border border-red-700 rounded-xl p-8 max-w-lg mx-auto backdrop-blur-sm">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-3">Unable to Load Movies</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => fetchRecommendations(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  } return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      {(title || showRefresh || showFilters) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
            {showRefresh && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                title="Refresh recommendations"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          {showFilters && (
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          )}
        </div>
      )}

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="space-y-8">
          {/* Group recommendations by type if showing multiple types */}
          {type ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="recommendation-item group">
                  <MovieCard movie={rec.movie} />
                  {/* Recommendation metadata */}
                  <div className="mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>{getRecommendationIcon(rec.recommendation_type)}</span>
                      <span className="truncate">
                        {getRecommendationTypeDisplay(rec.recommendation_type)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-yellow-400">
                        ⭐ {rec.movie.vote_average.toFixed(2)}
                      </span>
                      {rec.metadata.reasoning && (
                        <span
                          className="truncate max-w-24 cursor-help"
                          title={rec.metadata.reasoning}
                        >
                          {rec.metadata.matching_genres?.join(', ') || ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grouped by recommendation type
            Object.entries(
              recommendations.reduce((acc, rec) => {
                if (!acc[rec.recommendation_type]) {
                  acc[rec.recommendation_type] = []
                }
                acc[rec.recommendation_type].push(rec)
                return acc
              }, {} as Record<string, RecommendationResponse[]>)
            ).map(([recType, recs]) => (
              <div key={recType} className="recommendation-group">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>{getRecommendationIcon(recType)}</span>
                  {getRecommendationTypeDisplay(recType)}
                  <span className="text-sm text-gray-400">({recs.length})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {recs.map((rec) => (
                    <div key={rec.id} className="recommendation-item">
                      <MovieCard movie={rec.movie} />
                      <div className="mt-2 text-xs text-gray-400">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400">
                            ⭐ {rec.score.toFixed(1)}
                          </span>
                          {rec.metadata.reasoning && (
                            <span
                              className="truncate max-w-20 cursor-help"
                              title={rec.metadata.reasoning}
                            >
                              {rec.metadata.matching_genres?.slice(0, 2).join(', ') || ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size={20} />
                    Loading...
                  </div>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400 mb-6">
            Start watching movies and adding favorites to get personalized recommendations
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Recommendations
          </button>
        </div>
      )}
    </div>
  )
}

export default RecommendationSection
