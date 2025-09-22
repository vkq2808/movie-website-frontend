"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWatchHistory, deleteWatchHistory, WatchHistoryResponse } from '@/apis/watch-history.api';

export default function HistoryPage() {
  const [data, setData] = useState<WatchHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getWatchHistory(20, 1);
      if (res.success) setData(res.data);
      else setError(res.message || 'Failed to load watch history');
    } catch (e) {
      setError('Failed to load watch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const onDelete = async (movieId: string) => {
    try {
      const res = await deleteWatchHistory(movieId);
      if (res.success) await load();
    } catch { }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto" />
          <p className="text-gray-400 mt-4">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const items = data?.watchHistory ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-yellow-500/20 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Watch History</h1>
          <p className="mt-3 text-base md:text-lg text-gray-300">Continue where you left off or tidy up your history.</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🕒</div>
            <h3 className="text-xl font-semibold text-white mb-2">No watch history</h3>
            <p className="text-gray-400">Start watching movies to see them here.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const posterUrl = item.movie.poster?.url || '/placeholder-poster.jpg';
              const progress = Math.max(0, Math.min(100, Math.round(item.progress)));
              return (
                <li key={item.id} className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-16 flex-none overflow-hidden rounded-md">
                      <Image src={posterUrl} alt={item.movie.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/movie/${item.movie.id}`} className="text-white font-semibold hover:text-yellow-300 truncate">
                          {item.movie.title}
                        </Link>
                        <button
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                          onClick={() => onDelete(item.movie.id)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Last updated: {new Date(item.updated_at).toLocaleString()}
                      </div>
                      <div className="mt-3">
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mt-1 text-xs text-gray-300">Progress: {progress}%</div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
