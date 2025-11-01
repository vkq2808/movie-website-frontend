'use client'
import React, { useState, useEffect } from 'react'
import { getRecommendationStats, generateRecommendations, RecommendationStats } from '@/apis/recommendation.api'
import { getRecentlyWatched, getWatchStats } from '@/apis/watch-history.api'
import { Movie } from '@/types/api.types'
import RecommendationSection from './RecommendationSection'
import LoadingSpinner from '../Loading/LoadingSpinner'
import { RefreshCw, TrendingUp, Users, Target, Zap, Eye, Clock, Star } from 'lucide-react'

import { WatchStats } from '@/apis/watch-history.api'
import Image from 'next/image'

const RecommendationDashboard: React.FC = () => {
  const [stats, setStats] = useState<RecommendationStats | null>(null)
  const [recentlyWatched, setRecentlyWatched] = useState<Movie[]>([])
  const [watchStats, setWatchStats] = useState<WatchStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [generatingRecs, setGeneratingRecs] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'hybrid' | 'content_based' | 'collaborative' | 'trending'>('hybrid')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsResponse, recentResponse, watchStatsResponse] = await Promise.all([
        getRecommendationStats().catch(() => null),
        getRecentlyWatched(5).catch(() => null),
        getWatchStats().catch(() => null),
      ])

      if (statsResponse?.success) {
        setStats(statsResponse.data)
      }
      if (recentResponse?.success) {
        setRecentlyWatched(recentResponse.data)
      }
      if (watchStatsResponse?.success) {
        setWatchStats(watchStatsResponse.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRecommendations = async () => {
    try {
      setGeneratingRecs(true)
      await generateRecommendations({ force_refresh: true, limit: 50 })
      await fetchData() // Refresh stats
    } catch (error) {
      console.error('Error generating recommendations:', error)
    } finally {
      setGeneratingRecs(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'hybrid':
        return <Zap className="w-4 h-4" />
      case 'content_based':
        return <Target className="w-4 h-4" />
      case 'collaborative':
        return <Users className="w-4 h-4" />
      case 'trending':
        return <TrendingUp className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'hybrid':
        return 'For You'
      case 'content_based':
        return 'Similar Taste'
      case 'collaborative':
        return 'Community'
      case 'trending':
        return 'Trending'
      default:
        return tab
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={60} />
      </div>
    )
  }

  return (
    <div className="recommendation-dashboard min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Recommendations</h1>
            <p className="text-gray-400">Discover movies tailored to your taste</p>
          </div>
          <button
            onClick={handleGenerateRecommendations}
            disabled={generatingRecs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generatingRecs ? 'animate-spin' : ''}`} />
            {generatingRecs ? 'Generating...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Overview */}
        {(stats || watchStats) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats && (
              <>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold">Recommendations</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.total_recommendations}</p>
                  <p className="text-sm text-gray-400">Avg Score: {stats.average_score.toFixed(1)}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Hybrid</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.by_type.hybrid || 0}</p>
                  <p className="text-sm text-gray-400">Personalized</p>
                </div>
              </>
            )}
            {watchStats && (
              <>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold">Movies Watched</h3>
                  </div>
                  <p className="text-2xl font-bold">{watchStats.totalMoviesWatched}</p>
                  <p className="text-sm text-gray-400">Total viewed</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Avg Progress</h3>
                  </div>
                  <p className="text-2xl font-bold">{watchStats.averageProgress.toFixed(0)}%</p>
                  <p className="text-sm text-gray-400">Completion rate</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Recently Watched */}
        {recentlyWatched.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Continue Watching
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyWatched.map((movie) => (
                <div key={movie.id} className="relative group">
                  <Image
                    src={movie.posters?.[0]?.url || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    width={300}
                    height={450}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-gray-900 bg-opacity-80 rounded px-2 py-1">
                      <p className="text-xs text-white font-medium truncate">{movie.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            {(['hybrid', 'content_based', 'collaborative', 'trending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
              >
                {getTabIcon(tab)}
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Content */}
        <RecommendationSection
          type={activeTab}
          title={`${getTabLabel(activeTab)} Recommendations`}
          limit={20}
          showRefresh={false}
          className="mb-8"
        />
      </div>
    </div>
  )
}

export default RecommendationDashboard
