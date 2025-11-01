'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGenreStore, useLanguageStore } from '@/zustand'
import api, { apiEndpoint } from '@/utils/api.util'
import SearchMovieCard from '@/components/common/Search/SearchMovieCard'
import SearchFilter from '@/components/common/Search/SearchFilter'
import { useAuthStore } from '@/zustand'
import { saveSearchHistory } from '@/apis/search-history.api'

import { PaginatedApiResponse } from '@/types/api.response'
import { Movie } from '@/types/api.types'

interface SearchResult {
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}

// Component that uses useSearchParams
const SearchContent = () => {
  const language = useLanguageStore(l => l.currentLanguage);
  const genres = useGenreStore(state => state.genres)
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState({
    country: '',
    type: '',
    classification: '',
    genres: ['all'],
    year: '',
    sortBy: 'relevance'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const auth = useAuthStore()

  // Set up filters based on the UI requirements
  const [filterOptions, setFilterOptions] = useState({
    countries: [
      { id: '', label: 'Tất cả' },
      { id: 'us', label: 'Mỹ' },
      { id: 'ca', label: 'Canada' },
      { id: 'kr', label: 'Hàn Quốc' },
      { id: 'hk', label: 'Hồng Kông' },
      { id: 'jp', label: 'Nhật Bản' },
      { id: 'fr', label: 'Pháp' },
      { id: 'th', label: 'Thái Lan' },
      { id: 'cn', label: 'Trung Quốc' },
      { id: 'de', label: 'Đức' }
    ],
    classifications: [
      { id: '', label: 'Tất cả' },
      { id: 'p', label: 'Phổ biến (P)' },
      { id: 'k', label: 'Trẻ em (K)' },
      { id: 't13', label: 'T13' },
      { id: 't16', label: 'T16' },
      { id: 't18', label: 'T18' }
    ],
    genres: [
      { id: 'all', label: 'Tất cả thể loại' },
    ],
    years: [
      { id: '', label: 'Tất cả' },
      { id: '2025', label: '2025' },
      { id: '2024', label: '2024' },
      { id: '2023', label: '2023' },
      { id: '2022', label: '2022' },
      { id: '2021', label: '2021' },
      { id: '2020', label: '2020' },
      { id: '2019', label: '2019' },
      { id: '2018', label: '2018' },
      { id: '2017', label: '2017' },
      { id: '2016', label: '2016' },
      { id: '2015', label: '2015' },
    ],
    sortOptions: [
      { id: 'relevance', label: 'Liên quan' },
      { id: 'newest', label: 'Mới nhất' },
      { id: 'views', label: 'Lượt xem' },
      { id: 'imdb', label: 'IMDb' },
      { id: 'popularity', label: 'Phổ biến' },
    ]
  });

  const handleFilterChange = (filterType: string, value: string) => {

    if (filterType === 'genres') {
      if (value === 'all') {
        setActiveFilters(prev => ({
          ...prev,
          genres: ['all']
        }))
        return
      } else {
        // If a specific genre is selected, ensure 'all' is not in the genres array
        setActiveFilters(prev => ({
          ...prev,
          genres: prev.genres.includes('all') ? [value] : prev.genres.includes(value) ? prev.genres.filter(g => g !== value) : [...prev.genres, value]
        }))
        return
      }
    }

    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)
      try {        // Convert active filters to API parameters
        const params: Record<string, string | number> = {
          title: query,
          limit: 24,
          page: currentPage
        }

        // Add filters if they are set
        if (activeFilters.country) params.production_company = activeFilters.country
        if (activeFilters.genres) params.genres = activeFilters.genres.join(',')
        if (activeFilters.year) params.release_year = activeFilters.year

        // Add sorting
        if (activeFilters.sortBy === 'newest') {
          params.sort_by = 'release_date'
          params.sort_order = 'DESC'
        } else if (activeFilters.sortBy === 'views') {
          params.sort_by = 'popularity'
          params.sort_order = 'DESC'
        } else if (activeFilters.sortBy === 'imdb') {
          params.sort_by = 'vote_average'
          params.sort_order = 'DESC'
        } else if (activeFilters.sortBy === 'popularity') {
          params.sort_by = 'popularity'
          params.sort_order = 'DESC'
        }

        const response = await api.get<PaginatedApiResponse<Movie>>(`${apiEndpoint.MOVIE}`, { params })
        setResults(response.data)

        // Save search query to history if user is logged in
        if (auth.user && query.trim()) {
          saveSearchHistory(query.trim())
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
        const errorMessage = error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi không mong muốn khi tìm kiếm kết quả. Vui lòng thử lại sau.'
        setError(errorMessage)
        setResults(null)
      } finally {
        setLoading(false)
      }
    }

    if (query || searchParams.has('genres')) {
      fetchSearchResults()
    } else {
      setLoading(false)
      setResults(null)
      setCurrentPage(1)
    }
  }, [query, activeFilters, language, currentPage, auth.user, searchParams])

  useEffect(() => {
    // Update genres filter options with available genres from the store
    if (genres.length > 0) {
      setFilterOptions(prev => ({
        ...prev,
        genres: [
          { id: 'all', label: 'Tất cả thể loại' },
          ...genres.map(genre => ({
            id: genre.id,
            label: genre.names.find(n => n.iso_639_1 === language.iso_639_1)?.name || genre.id
          }))
        ]
      }))
      const queryGenres = searchParams.get('genres')


      setActiveFilters(prev => ({
        ...prev,
        ...(queryGenres ? { genres: queryGenres.split(',') } : {})
      }))
    }
  }, [genres, searchParams, language.iso_639_1])

  return (
    <div className="bg-slate-100 min-h-screen">
      <main className="min-h-screen bg-black text-white pt-20 pb-10 px-4 md:px-8">
        <div className="container mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {query && `Kết quả tìm kiếm cho: "${query}"`}
            </h1>
            <p className="text-gray-400">
              {query && `${results?.pagination.total || 0} kết quả được tìm thấy`}
            </p>
          </div>        {/* Filter Section */}
          <div className="mb-8 space-y-6 bg-gray-900 p-4 rounded-lg overflow-x-auto scrollbar-thin">
            <div className="space-y-4 min-w-[600px]">
              <SearchFilter
                title="Quốc gia"
                options={filterOptions.countries}
                activeValue={activeFilters.country}
                onChange={(value) => handleFilterChange('country', value)}
              />

              <SearchFilter
                title="Xếp hạng"
                options={filterOptions.classifications}
                activeValue={activeFilters.classification}
                onChange={(value) => handleFilterChange('classification', value)}
              />

              <SearchFilter
                title="Thể loại"
                options={filterOptions.genres}
                activeValue={activeFilters.genres}
                onChange={(value) => handleFilterChange('genres', value)}
              />

              <SearchFilter
                title="Năm"
                options={filterOptions.years}
                activeValue={activeFilters.year}
                onChange={(value) => handleFilterChange('year', value)}
              />

              <SearchFilter
                title="Sắp xếp theo"
                options={filterOptions.sortOptions}
                activeValue={activeFilters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
              />
            </div>
          </div>{/* Results Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">
                Lỗi
              </h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : results?.data && results.data.length > 0 ? (<>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {results.data.map((movie) => (
                <div key={movie.id} className="flex-none">
                  <SearchMovieCard movie={movie} />
                </div>
              ))}
            </div>{/* Pagination */}
            {results.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {/* Previous page button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${currentPage === 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  aria-label="Trang trước"
                >
                  &lt;
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, results.pagination.totalPages) }).map((_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (results.pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= results.pagination.totalPages - 2) {
                    pageNum = results.pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full ${pageNum === currentPage
                        ? 'bg-yellow-500 text-black font-bold'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Ellipsis for many pages */}
                {results.pagination.totalPages > 5 && currentPage < results.pagination.totalPages - 2 && (
                  <span className="flex items-center justify-center px-2">...</span>
                )}

                {/* Last page button for many pages */}
                {results.pagination.totalPages > 5 && currentPage < results.pagination.totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(results.pagination.totalPages)}
                    className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    aria-label={`Page ${results.pagination.totalPages}`}
                  >
                    {results.pagination.totalPages}
                  </button>
                )}

                {/* Next page button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, results.pagination.totalPages))}
                  disabled={currentPage === results.pagination.totalPages}
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${currentPage === results.pagination.totalPages
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  aria-label="Trang sau"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold mb-2">
                Không tìm thấy kết quả
              </h2>
              <p className="text-gray-400">
                Thử điều chỉnh tìm kiếm hoặc bộ lọc để tìm thấy những gì bạn đang tìm kiếm
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Loading component
const SearchLoading = () => {
  return (
    <div className="bg-slate-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Đang tải kết quả tìm kiếm...</h1>
          <div className="animate-pulse mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md h-72">
                  <div className="w-full h-40 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  )
}

export default SearchPage
