'use client'
import React, { useState } from 'react'
import { Movie } from '@/zustand'
import TabContent from './TabContent'

interface MovieTabsProps {
  movie: Movie
}

type TabType = 'episode-tab' | 'gallery-tab' | 'cast-tab' | 'suggestion-tab'

const MovieTabs: React.FC<MovieTabsProps> = ({ movie }) => {
  const [activeTab, setActiveTab] = useState<TabType>('episode-tab')

  const tabs: ReadonlyArray<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'episode-tab', label: 'Tập phim', icon: null },
    { id: 'gallery-tab', label: 'Thư viện', icon: null },
    { id: 'cast-tab', label: 'Diễn viên', icon: null },
    { id: 'suggestion-tab', label: 'Gợi ý', icon: null },
  ] as const

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <TabContent activeTab={activeTab} movie={movie} />
    </div>
  )
}

export default MovieTabs
