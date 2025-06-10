'use client'
import React, { useState } from 'react'
import { Movie } from '@/zustand'
import TabContent from './TabContent'
import { useTranslation } from '@/contexts/translation.context'

interface MovieTabsProps {
  movie: Movie
}

type TabType = 'episode-tab' | 'gallery-tab' | 'cast-tab' | 'suggestion-tab'

const MovieTabs: React.FC<MovieTabsProps> = ({ movie }) => {
  const { language, t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('episode-tab')

  const tabs = [
    { id: 'episode-tab', label: t('Episode'), icon: null },
    { id: 'gallery-tab', label: t('Gallery'), icon: null },
    { id: 'cast-tab', label: t('Cast'), icon: null },
    { id: 'suggestion-tab', label: t('Suggestion'), icon: null },
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
