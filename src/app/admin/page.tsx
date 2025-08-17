"use client";
import { AdminGuard, AdminLayout } from '@/components/admin';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminApi, type AdminStats } from '@/apis/admin.api';
import React from 'react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<AdminStats | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAdminStats();
        if (!mounted) return;
        if (res?.success && res.data) {
          setStats(res.data);
        } else {
          setError(res?.message || 'Failed to load stats');
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load stats';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminGuard>
      <AdminLayout>
        <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>
        {loading && (
          <div className="flex h-40 items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!loading && error && (
          <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
        )}
        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Users" value={stats.totalUsers} />
              <StatCard title="Total Movies" value={stats.totalMovies} />
              <StatCard title="Total Views" value={stats.totalViews} />
              <StatCard title="New Users (7d)" value={stats.newUsersThisWeek} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded border border-gray-800 p-4">
                <h2 className="mb-3 text-lg font-medium">Recent Activity</h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  {stats.recentActivity?.length ? (
                    stats.recentActivity.slice(0, 8).map((a) => (
                      <li key={a.id} className="rounded border border-gray-800 bg-gray-900/40 p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{a.type}</span>
                          <span className="text-xs text-gray-400">{new Date(a.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-400">{a.description}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No recent activity</li>
                  )}
                </ul>
              </div>
              <div className="rounded border border-gray-800 p-4">
                <h2 className="mb-3 text-lg font-medium">Top Genres</h2>
                <ul className="space-y-2 text-sm text-gray-300">
                  {stats.genreDistribution?.length ? (
                    stats.genreDistribution.slice(0, 8).map((g) => (
                      <li key={g.name} className="flex items-center justify-between rounded border border-gray-800 bg-gray-900/40 p-2">
                        <span>{g.name}</span>
                        <span className="text-gray-400">{g.value}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No data</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </AdminGuard>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-gray-800 bg-gray-950 p-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
