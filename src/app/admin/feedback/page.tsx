"use client";
import React from 'react';
import { adminApi, type AdminFeedback } from '@/apis/admin.api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/zustand';
import { useToast } from '@/hooks/useToast';
import { FeedbackTable } from './components/FeedbackTable';
import { FeedbackFilters } from './components/FeedbackFilters';

export default function AdminFeedbackPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [feedbacks, setFeedbacks] = React.useState<AdminFeedback[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<'active' | 'hidden' | 'all'>('all');

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const toast = useToast();

  const load = React.useCallback(async () => {
    // CRITICAL: Only call admin API when:
    // 1. Auth state is hydrated (we know if user exists)
    // 2. User exists and is admin
    if (!hydrated) return;
    if (!user) return;
    if (user.role !== 'admin') return;

    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAllFeedback({
        page,
        limit,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
      });

      if (res.success && res.data) {
        setFeedbacks(res.data.feedbacks);
        setTotal(res.data.total);
      } else {
        setError(res.message || 'Failed to load feedbacks');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load feedbacks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, hydrated, user]);

  // Two-step auth check: hydration + role validation
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      // If auth state not hydrated yet, fetch user info
      if (!user && !hydrated) {
        await fetchUser();
      }

      if (!mounted) return;

      // If hydrated and no user -> redirect to login
      if (hydrated && !user) {
        router.replace('/auth/login?from=/admin/feedback');
        return;
      }

      // If user exists but not admin -> redirect to home (or 403)
      if (hydrated && user && user.role !== 'admin') {
        router.replace('/403');
        return;
      }

      // Otherwise attempt to load (only runs when user is confirmed admin)
      await load();
    })();

    return () => {
      mounted = true;
    };
  }, [load, hydrated, user, fetchUser, router]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleRefresh = async () => {
    await load();
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Feedback Management</h1>
          <p className="mt-1 text-sm text-gray-400">Review and moderate user feedback</p>
        </div>
      </div>

      <div className="mb-6">
        <FeedbackFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      </div>

      {error ? (
        <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
      ) : (
        <>
          <FeedbackTable
            feedbacks={feedbacks}
            isLoading={loading}
            onRefresh={handleRefresh}
          />

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
                  <option key={n} value={n}>
                    {n}/page
                  </option>
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
        </>
      )}
    </>
  );
}
