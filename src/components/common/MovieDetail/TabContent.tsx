'use client'
import React from 'react'
import { Movie } from '@/zustand'
import EpisodesTab from './tabs/EpisodesTab'
import GalleryTab from './tabs/GalleryTab'
import CastTab from './tabs/CastTab'
import SuggestionsTab from './tabs/SuggestionsTab'

interface TabContentProps {
  activeTab: string
  movie: Movie
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, movie }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'episode-tab':
        return <EpisodesTab movie={movie} />
      case 'gallery-tab':
        return <GalleryTab movie={movie} />
      case 'cast-tab':
        return <CastTab movie={movie} />
      case 'suggestion-tab':
        return <SuggestionsTab movie={movie} />
      default:
        return <EpisodesTab movie={movie} />
    }
  }

  return (
    <div className="tab-content">
      {renderTabContent()}
    </div>
  )
}

export default TabContent
