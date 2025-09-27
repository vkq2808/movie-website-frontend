"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/apis/admin.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Film } from 'lucide-react';
import { useGenreStore } from '@/zustand';

export default function GenresPage() {
  const genres = useGenreStore((state) => state.genres);
  const fetchGenres = useGenreStore((state) => state.fetchGenres);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await fetchGenres();
      } catch (e) {
        setError('Failed to load genres');
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchGenres]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Loading genres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-gray-800/60 border border-red-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Unable to load genres</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-purple-600/20 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Film className="h-8 w-8 text-yellow-400" />
              Browse by Genre
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-300">
              Explore movies organized by your favorite genres and discover something new.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        {genres.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Genres Found</h3>
            <p className="text-gray-400">Please check back later.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {genres.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/search?genres=${encodeURIComponent(g.id)}`}
                  className="block group rounded-xl border border-gray-700/60 bg-gray-800/40 hover:bg-gray-800/70 hover:border-gray-600 transition-colors p-4 h-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
                      {g.names[0].name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate group-hover:text-yellow-300">
                        {g.names[0].name}
                      </div>
                      <div className="text-xs text-gray-400">Tap to explore</div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
