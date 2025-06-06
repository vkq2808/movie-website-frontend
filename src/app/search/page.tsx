'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Movie } from '@/zustand'
import api, { apiEnpoint } from '@/utils/api.util'
import SearchMovieCard from '@/components/common/Search/SearchMovieCard'
import SearchFilter from '@/components/common/Search/SearchFilter'
import { useLanguageStore, useAuthStore } from '@/zustand'
import { saveSearchHistory } from '@/apis/search-history.api'

interface SearchResult {
  data: Movie[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    appliedFilters: Record<string, any>;
  }
}

const SearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState({
    country: '',
    type: '',
    classification: '',
    genre: '',
    year: '',
    sortBy: 'relevance'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const { currentLanguage } = useLanguageStore()
  const { auth } = useAuthStore()

  // Set up filters based on the UI requirements
  const filterOptions = {
    countries: [
      { id: '', label: currentLanguage.iso_639_1 === 'en' ? 'All' : 'Tất cả' },
      { id: 'us', label: currentLanguage.iso_639_1 === 'en' ? 'US' : 'Mỹ' },
      { id: 'ca', label: 'Canada' },
      { id: 'kr', label: currentLanguage.iso_639_1 === 'en' ? 'South Korea' : 'Hàn Quốc' },
      { id: 'hk', label: currentLanguage.iso_639_1 === 'en' ? 'Hong Kong' : 'Hồng Kông' },
      { id: 'jp', label: currentLanguage.iso_639_1 === 'en' ? 'Japan' : 'Nhật Bản' },
      { id: 'fr', label: currentLanguage.iso_639_1 === 'en' ? 'France' : 'Pháp' },
      { id: 'th', label: currentLanguage.iso_639_1 === 'en' ? 'Thailand' : 'Thái Lan' },
      { id: 'cn', label: currentLanguage.iso_639_1 === 'en' ? 'China' : 'Trung Quốc' },
      { id: 'de', label: currentLanguage.iso_639_1 === 'en' ? 'Germany' : 'Đức' }
    ],
    types: [
      { id: '', label: currentLanguage.iso_639_1 === 'en' ? 'All' : 'Tất cả' },
      { id: 'movie', label: currentLanguage.iso_639_1 === 'en' ? 'Movie' : 'Phim lẻ' },
      { id: 'series', label: currentLanguage.iso_639_1 === 'en' ? 'Series' : 'Phim bộ' }
    ],
    classifications: [
      { id: '', label: currentLanguage.iso_639_1 === 'en' ? 'All' : 'Tất cả' },
      { id: 'p', label: currentLanguage.iso_639_1 === 'en' ? 'General (P)' : 'Phổ biến (P)' },
      { id: 'k', label: currentLanguage.iso_639_1 === 'en' ? 'Kids (K)' : 'Trẻ em (K)' },
      { id: 't13', label: 'T13' },
      { id: 't16', label: 'T16' },
      { id: 't18', label: 'T18' }
    ],
    genres: [
      { id: '', label: currentLanguage.iso_639_1 === 'en' ? 'All' : 'Tất cả' },
      { id: 'anime', label: 'Anime' },
      { id: 'bi-an', label: currentLanguage.iso_639_1 === 'en' ? 'Mystery' : 'Bí ẩn' },
      { id: 'chieu-rap', label: currentLanguage.iso_639_1 === 'en' ? 'In theaters' : 'Chiếu rạp' },
      { id: 'chinh-kich', label: currentLanguage.iso_639_1 === 'en' ? 'Drama' : 'Chính kịch' },
      { id: 'chuyen-the', label: currentLanguage.iso_639_1 === 'en' ? 'Adaptation' : 'Chuyển thể' },
      { id: 'chinh-luan', label: currentLanguage.iso_639_1 === 'en' ? 'Commentary' : 'Chính luận' },
      { id: 'hanh-dong', label: currentLanguage.iso_639_1 === 'en' ? 'Action' : 'Hành động' },
      { id: 'giang-sinh', label: currentLanguage.iso_639_1 === 'en' ? 'Christmas' : 'Giáng sinh' },
      { id: 'hai-huoc', label: currentLanguage.iso_639_1 === 'en' ? 'Comedy' : 'Hài hước' },
    ],
    years: [
      { id: '', label: currentLanguage.iso_639_1 === 'en' ? 'All' : 'Tất cả' },
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
      { id: 'relevance', label: currentLanguage.iso_639_1 === 'en' ? 'Relevance' : 'Liên quan' },
      { id: 'newest', label: currentLanguage.iso_639_1 === 'en' ? 'Newest' : 'Mới nhất' },
      { id: 'views', label: currentLanguage.iso_639_1 === 'en' ? 'Most viewed' : 'Lượt xem' },
      { id: 'imdb', label: 'IMDb' },
      { id: 'popularity', label: currentLanguage.iso_639_1 === 'en' ? 'Popularity' : 'Phổ biến' },
    ]
  }

  const handleFilterChange = (filterType: string, value: string) => {
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
        const params: Record<string, any> = {
          title: query,
          limit: 24,
          page: currentPage
        }

        // Add filters if they are set
        if (activeFilters.country) params.production_company = activeFilters.country
        if (activeFilters.genre) params.genre = activeFilters.genre
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
        const response = await api.get(`${apiEnpoint.MOVIE}`, { params })
        setResults(response.data)

        // Save search query to history if user is logged in
        if (auth.accessToken && query.trim()) {
          saveSearchHistory(query.trim())
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
        const errorMessage = error instanceof Error
          ? error.message
          : currentLanguage.iso_639_1 === 'en'
            ? 'Failed to load search results. Please try again.'
            : 'Không thể tải kết quả tìm kiếm. Vui lòng thử lại.'
        setError(errorMessage)
        setResults(null)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchSearchResults()
    } else {
      setLoading(false)
      setResults(null)
      setCurrentPage(1)
    }
  }, [query, activeFilters, currentLanguage.iso_639_1, currentPage, auth.accessToken])

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-10 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {currentLanguage.iso_639_1 === 'en' ? 'Search results for:' : 'Kết quả tìm kiếm cho:'} "{query}"
          </h1>
          <p className="text-gray-400">
            {results?.meta.totalCount || 0} {currentLanguage.iso_639_1 === 'en' ? 'results found' : 'kết quả được tìm thấy'}
          </p>
        </div>        {/* Filter Section */}
        <div className="mb-8 space-y-6 bg-gray-900 p-4 rounded-lg overflow-x-auto scrollbar-thin">
          <div className="space-y-4 min-w-[600px]">
            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Country:' : 'Quốc gia:'}
              options={filterOptions.countries}
              activeValue={activeFilters.country}
              onChange={(value) => handleFilterChange('country', value)}
            />

            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Type:' : 'Loại phim:'}
              options={filterOptions.types}
              activeValue={activeFilters.type}
              onChange={(value) => handleFilterChange('type', value)}
            />

            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Rating:' : 'Xếp hạng:'}
              options={filterOptions.classifications}
              activeValue={activeFilters.classification}
              onChange={(value) => handleFilterChange('classification', value)}
            />

            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Genre:' : 'Thể loại:'}
              options={filterOptions.genres}
              activeValue={activeFilters.genre}
              onChange={(value) => handleFilterChange('genre', value)}
            />

            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Year:' : 'Năm:'}
              options={filterOptions.years}
              activeValue={activeFilters.year}
              onChange={(value) => handleFilterChange('year', value)}
            />

            <SearchFilter
              title={currentLanguage.iso_639_1 === 'en' ? 'Sort by:' : 'Sắp xếp theo:'}
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
              {currentLanguage.iso_639_1 === 'en' ? 'Error' : 'Lỗi'}
            </h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition-colors"
            >
              {currentLanguage.iso_639_1 === 'en' ? 'Try Again' : 'Thử lại'}
            </button>
          </div>
        ) : results?.data && results.data.length > 0 ? (<>            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {results.data.map((movie) => (
            <div key={movie.id} className="flex-none">
              <SearchMovieCard movie={movie} />
            </div>
          ))}
        </div>{/* Pagination */}
          {results.meta.totalPages > 1 && (
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
                aria-label={currentLanguage.iso_639_1 === 'en' ? 'Previous page' : 'Trang trước'}
              >
                &lt;
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, results.meta.totalPages) }).map((_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (results.meta.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= results.meta.totalPages - 2) {
                  pageNum = results.meta.totalPages - 4 + i;
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
                    aria-label={`${currentLanguage.iso_639_1 === 'en' ? 'Page' : 'Trang'} ${pageNum}`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Ellipsis for many pages */}
              {results.meta.totalPages > 5 && currentPage < results.meta.totalPages - 2 && (
                <span className="flex items-center justify-center px-2">...</span>
              )}

              {/* Last page button for many pages */}
              {results.meta.totalPages > 5 && currentPage < results.meta.totalPages - 2 && (
                <button
                  onClick={() => setCurrentPage(results.meta.totalPages)}
                  className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                  aria-label={`${currentLanguage.iso_639_1 === 'en' ? 'Page' : 'Trang'} ${results.meta.totalPages}`}
                >
                  {results.meta.totalPages}
                </button>
              )}

              {/* Next page button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, results.meta.totalPages))}
                disabled={currentPage === results.meta.totalPages}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentPage === results.meta.totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                aria-label={currentLanguage.iso_639_1 === 'en' ? 'Next page' : 'Trang sau'}
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
              {currentLanguage.iso_639_1 === 'en' ? 'No results found' : 'Không tìm thấy kết quả'}
            </h2>
            <p className="text-gray-400">
              {currentLanguage.iso_639_1 === 'en'
                ? 'Try adjusting your search or filters to find what you\'re looking for'
                : 'Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn để tìm thứ bạn đang tìm kiếm'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default SearchPage
