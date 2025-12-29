"use client";
import React from 'react';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import { adminApi, type AdminMovie } from '@/apis/admin.api';
import Link from 'next/link';
import { MovieStatus } from '@/constants/enum';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand';
import { useToast } from '@/hooks/useToast';

export default function AdminMoviesPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [movies, setMovies] = React.useState<AdminMovie[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<MovieStatus | 'all'>('all');
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const toast = useToast();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    // Guard: do not call admin API until auth status known and user is admin
    if (!hydrated) return;
    if (!user) return; // will be redirected by guard
    if (user.role !== 'admin') return;

    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getMovies({ page, limit, search: search || undefined, status });
      if (res.success && res.data) {
        setMovies(res.data.movies);
        setTotal(res.data.total);
      } else {
        setError(res.message || 'Failed to load movies');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load movies';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, hydrated, user]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user && !hydrated) {
        await fetchUser();
      }
      if (!mounted) return;
      // If hydrated and no user -> redirect to login
      if (hydrated && !user) {
        router.replace('/auth/login?from=/admin/movies');
        return;
      }
      // If user exists but not admin -> redirect to 403
      if (hydrated && user && user.role !== 'admin') {
        router.replace('/403');
        return;
      }
      // Otherwise attempt load (only runs when user is admin)
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, [load, hydrated, user, fetchUser, router]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (id: string) => {
    // Two-step confirmation: first click sets confirmingId, second click proceeds.
    if (confirmingId !== id) {
      setConfirmingId(id);
      // auto-reset after 5s
      setTimeout(() => setConfirmingId((cur) => (cur === id ? null : cur)), 5000);
      return;
    }

    setDeletingId(id);
    try {
      toast.info('Deleting movie...', { duration: 3000 });
      await adminApi.deleteMovie(id);
      toast.success('Movie deleted');
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete';
      toast.error(msg);
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Movies</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your movie catalog</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500 md:w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.currentTarget.value as typeof status)}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={() => router.push("/admin/movies/create")}
            className='cursor-pointer'
          >
            Create
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Release</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="flex h-56 items-center justify-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id} className="border-b border-gray-800">
                    <td className="px-3 py-2 font-medium text-gray-100">
                      <Link href={`/admin/movies/${m.id}`}>{m.title}</Link>
                    </td>
                    <td className="px-3 py-2 text-gray-300">{new Date(m.release_date).toLocaleDateString()}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          'rounded px-2 py-1 text-xs ' +
                          (m.status === 'published'
                            ? 'bg-green-500/10 text-green-300'
                            : 'bg-yellow-500/10 text-yellow-300')
                        }
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-300">{m.vote_average?.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/movies/${m.id}/update`)}
                          className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          disabled={deletingId === m.id}
                          className={`rounded px-3 py-1 text-xs text-white ${deletingId === m.id ? 'bg-red-400/60' : 'bg-red-600 hover:bg-red-500'}`}
                        >
                          {deletingId === m.id ? 'Deleting...' : confirmingId === m.id ? 'Confirm delete' : 'Delete'}
                        </button>
                        {confirmingId === m.id && (
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="rounded border border-gray-700 px-2 py-1 text-xs text-gray-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-400" colSpan={5}>No movies found</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {page} of {totalPages} • {total} total
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.currentTarget.value));
                  setPage(1);
                }}
                className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}/page</option>
                ))}
              </select>
              <button
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-200 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div >
      )
}
    </>
  );
}
