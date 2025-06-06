'use client'
import React, { useState } from 'react'
import { Movie } from '@/zustand'
import TabContent from './TabContent'

interface MovieTabsProps {
  movie: Movie
}

type TabType = 'tapphim' | 'gallery' | 'dienvier' | 'dexuat'

const MovieTabs: React.FC<MovieTabsProps> = ({ movie }) => {
  const [activeTab, setActiveTab] = useState<TabType>('tapphim')

  const tabs = [
    { id: 'tapphim', label: 'Tập phim', icon: null },
    { id: 'gallery', label: 'Gallery', icon: null },
    { id: 'dienvier', label: 'Diễn viên', icon: null },
    { id: 'dexuat', label: 'Đề xuất', icon: null },
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
