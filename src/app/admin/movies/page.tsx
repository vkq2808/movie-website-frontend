"use client";
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminApi, type AdminMovie } from '@/apis/admin.api';
import Link from 'next/link';
import { MovieStatus } from '@/constants/enum';
import { useRouter } from 'next/navigation';

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

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMovies({ page, limit, search: search || undefined, status });
      if (res.success && res.data) {
        setMovies(res.data.movies);
        setTotal(res.data.total);
        console.log(res.data)
      } else {
        setError(res.message || 'Failed to load movies');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load movies';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete this movie?');
    if (!ok) return;
    try {
      await adminApi.deleteMovie(id);
      // Refresh list
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
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
          <div className='flex flex-row'>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Release</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Rating</th>
                </tr>
              </thead>
              {loading ? (
                <div className="flex h-56 items-center justify-center"><LoadingSpinner /></div>
              ) : <tbody>
                {movies.map((m) => (
                  <tr key={'d-' + m.id} className="border-b border-gray-800"
                  >
                    <td className="px-3 py-2 font-medium text-gray-100">
                      <Link href={`/admin/movies/${m.id}`}>{m.title}
                      </Link>
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
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-400" colSpan={6}>No movies found</td>
                  </tr>
                )}
              </tbody>}
            </table>
            <table className="w-1/5 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              {loading ? (
                <div className="flex h-56 items-center justify-center"></div>
              ) : <tbody>
                {movies.map((m) => (
                  <tr key={'a-' + m.id} className="border-b border-gray-800">
                    <td className="px-3 py-2 text-right gap-4 flex">
                      <button
                        onClick={() => router.push(`/admin/movies/${m.id}/update`)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-400" colSpan={6}></td>
                  </tr>
                )}
              </tbody>}
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
        </div>
      )}
    </>
  );
}
