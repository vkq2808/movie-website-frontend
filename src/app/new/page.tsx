"use client";
import { useEffect, useMemo, useState } from 'react';
import { getMovies } from '@/apis/movie.api';
import { Movie } from '@/zustand';
import { CalendarDays, Flame } from 'lucide-react';
import { MovieCard, LoadingSpinner } from '@/components/common';

export default function NewReleasesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (nextPage: number, append = false) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true);
      const res = await getMovies({ page: nextPage, limit: 24, sort_by: 'release_date', sort_order: 'DESC' });
      if (res.data) {
        setMovies(prev => append ? [...prev, ...res.data] : res.data);
        setHasMore(nextPage < (res.pagination?.totalPages || nextPage));
        setPage(nextPage);
      }
    } catch (e) {
      setError('Failed to load new releases');
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  };

  useEffect(() => { void fetchPage(1); }, []);

  const onLoadMore = () => {
    if (!loading && hasMore) void fetchPage(page + 1, true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-orange-500/20 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-400" /> New Releases
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-300">
              The latest movies, freshly added and ready to discover.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        {loading && movies.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-gray-800/60 border border-red-700 rounded-xl p-6 text-red-400">{error}</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🆕</div>
            <h3 className="text-xl font-semibold text-white mb-2">No new releases found</h3>
            <p className="text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((m) => (
                <div key={m.id} className="flex-none">
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  disabled={loadingMore}
                  onClick={onLoadMore}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
