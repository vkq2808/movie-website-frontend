'use client'
import React from 'react'
import { Movie } from '@/zustand'
import MovieDetailTab from './tabs/MovieDetailTab'
import GalleryTab from './tabs/GalleryTab'
import CommentsTab from './tabs/CommentsTab'
import CastTab from './tabs/CastTab'
import { TabType } from './MovieTabs'

interface TabContentProps {
  activeTab: TabType;
  movie: Movie
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, movie }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail-tab':
        return <MovieDetailTab movie={movie} />
      case 'gallery-tab':
        return <GalleryTab movie={movie} />
      case 'cast-tab':
        return <CastTab movie={movie} />
      case 'comments-tab':
        return <CommentsTab movieId={movie.id} />
      default:
        return <MovieDetailTab movie={movie} />
    }
  }

  return (
    <div className="tab-content">
      {renderTabContent()}
    </div>
  )
}

export default TabContent
