'use client'
import React, { useState, useEffect } from 'react'
import { Movie, useLanguageStore } from '@/zustand'
import Link from 'next/link'

interface SuggestionsTabProps {
  movie: Movie
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ movie }) => {
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { currentLanguage } = useLanguageStore()

  // Function to get genre name based on current language
  const getGenreName = (genre: any) => {
    const nameForLanguage = genre.names?.find((n: any) => n.iso_639_1 === currentLanguage.iso_639_1)
    return nameForLanguage ? nameForLanguage.name : genre.names?.[0]?.name || 'Unknown'
  }

  useEffect(() => {
    // Simulate fetching suggested movies
    // In real implementation, you'd fetch movies similar to current movie
    const fetchSuggestedMovies = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Demo suggested movies - replace with actual API call
      const demoMovies: Movie[] = Array.from({ length: 12 }, (_, index) => ({
        id: `suggested-${index}`,
        title: `Suggested Movie ${index + 1}`,
        description: `This is a suggested movie description for movie ${index + 1}. It shares similar themes with the current movie.`,
        release_date: `202${index % 4}-0${(index % 12) + 1}-01`,
        duration: 90 + (index * 10),
        vote_average: 7.5 + (index % 3),
        vote_count: 1000 + (index * 100),
        poster: {
          id: `poster-${index}`,
          url: `https://via.placeholder.com/300x450?text=Movie+${index + 1}`,
          alt: `Poster for suggested movie ${index + 1}`,
          width: 300,
          height: 450,
          bytes: 0,
          created_at: '',
          updated_at: '',
        },
        backdrop: {
          id: `backdrop-${index}`,
          url: `https://via.placeholder.com/1280x720?text=Backdrop+${index + 1}`,
          alt: `Backdrop for suggested movie ${index + 1}`,
          width: 1280,
          height: 720,
          bytes: 0,
          created_at: '',
          updated_at: '',
        },
        genres: movie.genres.slice(0, 2), // Use some genres from current movie
        videos: [],
        trailer_url: null,
        rating: 7.5 + (index % 3),
        created_at: '',
        updated_at: '',
      }))

      setSuggestedMovies(demoMovies)
      setLoading(false)
    }

    fetchSuggestedMovies()
  }, [movie])

  const MovieCard = ({ suggestedMovie }: { suggestedMovie: Movie }) => (
    <Link href={`/movie/${suggestedMovie.id}`}>
      <div className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all duration-300 cursor-pointer">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {suggestedMovie.poster ? (
            <img
              src={suggestedMovie.poster.url}
              alt={suggestedMovie.poster.alt || suggestedMovie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No poster</span>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
            {suggestedMovie.vote_average?.toFixed(1) || '?'} ★
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {suggestedMovie.title}
          </h3>

          <div className="flex items-center text-xs text-gray-400 mb-2">
            <span>{suggestedMovie.release_date?.split('-')[0] || 'N/A'}</span>
            {suggestedMovie.duration && (
              <>
                <span className="mx-1">•</span>
                <span>{suggestedMovie.duration} phút</span>
              </>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2">
            {suggestedMovie.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
              >
                {getGenreName(genre)}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs line-clamp-2">
            {suggestedMovie.description || 'No description available.'}
          </p>
        </div>
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Phim đề xuất</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-gray-700"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Phim đề xuất</h2>
        <p className="text-gray-400 text-sm">
          Dựa trên thể loại và đánh giá tương tự
        </p>
      </div>

      {/* Similar Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {suggestedMovies.map((suggestedMovie) => (
          <MovieCard key={suggestedMovie.id} suggestedMovie={suggestedMovie} />
        ))}
      </div>

      {/* More Suggestions Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Có thể bạn cũng thích</h3>

        <div className="space-y-3">
          {suggestedMovies.slice(0, 4).map((suggestedMovie, index) => (
            <Link key={suggestedMovie.id} href={`/movie/${suggestedMovie.id}`}>
              <div className="flex gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="w-16 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  {suggestedMovie.poster ? (
                    <img
                      src={suggestedMovie.poster.url}
                      alt={suggestedMovie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm mb-1 truncate">
                    {suggestedMovie.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">
                    {suggestedMovie.release_date?.split('-')[0]} • {suggestedMovie.vote_average?.toFixed(1)} ★
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-2">
                    {suggestedMovie.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SuggestionsTab
