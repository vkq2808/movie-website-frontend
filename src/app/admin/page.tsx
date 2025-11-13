"use client";

import React from "react";
import LoadingSpinner from "@/components/common/Loading/LoadingSpinner";
import { adminApi, AdminGenre, type AdminStats } from "@/apis/admin.api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguageStore } from "@/zustand";
import Image from "next/image";

// ===================== MAIN COMPONENT =====================
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
          setError(res?.message || "Failed to load stats");
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load stats";
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex h-60 items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">
        {error}
      </div>
    );

  if (!stats)
    return (
      <div className="text-gray-400">No data available for dashboard.</div>
    );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Movies" value={stats.totalMovies} />
        <StatCard title="Total Views" value={stats.totalViews} />
        <StatCard title="Views Today" value={stats.viewsToday} />
        <StatCard title="Views This Month" value={stats.viewsThisMonth} />
        <StatCard title="New Users (7d)" value={stats.newUsersThisWeek} />
      </div>

      {/* VIEW CHART + TOP MOVIES */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ViewTrendsChart data={stats.viewTrends} />
        <TopMovies movies={stats.topMovies} />
      </div>

      {/* SYSTEM STATUS + ACTIVITY */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SystemStatus system={stats.system} />
        <RecentActivityList activities={stats.recentActivity} />
      </div>

      {/* GENRE DISTRIBUTION */}
      <div className="mt-6">
        <GenreDistribution genres={stats.genreDistribution} />
      </div>
    </div>
  );
}

// ===================== COMPONENTS =====================

// Small stat card
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-gray-800 bg-gray-950 p-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value?.toLocaleString()}</div>
    </div>
  );
}

// Chart for views over time
function ViewTrendsChart({
  data,
}: {
  data: { date: string; views: number }[];
}) {
  return (
    <div className="rounded border border-gray-800 p-4">
      <h2 className="mb-3 text-lg font-medium">Views Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Top 10 movies list
function TopMovies({
  movies,
}: {
  movies: { id: string; title: string; views: number; thumbnail: string }[];
}) {
  return (
    <div className="rounded border border-gray-800 p-4">
      <h2 className="mb-3 text-lg font-medium">Top 10 Movies</h2>
      <ul className="space-y-2 text-sm text-gray-300">
        {movies?.length ? (
          movies?.slice(0, 10).map((movie, i) => (
            <li
              key={movie.id}
              className="flex items-center gap-3 rounded border border-gray-800 bg-gray-900/40 p-2"
            >
              <Image
                src={movie.thumbnail}
                alt={movie.title}
                className="rounded object-cover"
                height={40}
                width={40}
              />
              <div className="flex-1">
                <div className="font-medium">
                  {i + 1}. {movie.title}
                </div>
                <div className="text-gray-400">
                  {movie.views.toLocaleString()} views
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No movie data available</li>
        )}
      </ul>
    </div>
  );
}

// System status
function SystemStatus({
  system,
}: {
  system: {
    storageUsedGB: number;
    totalStorageGB: number;
    activeServers: number;
    recentErrors: { id: string; message: string; timestamp: string }[];
  };
}) {
  const usagePercent = Math.round(
    (system?.storageUsedGB / system?.totalStorageGB) * 100
  );

  return (
    <div className="rounded border border-gray-800 p-4">
      <h2 className="mb-3 text-lg font-medium">System Status</h2>
      <p>
        Storage:{" "}
        <span className="font-medium">
          {system?.storageUsedGB}/{system?.totalStorageGB} GB
        </span>{" "}
        ({usagePercent}%)
      </p>
      <p>Active Servers: {system?.activeServers}</p>

      <h3 className="mt-3 text-sm font-semibold text-red-400">Recent Errors</h3>
      <ul className="mt-1 space-y-1 text-xs text-gray-400">
        {system?.recentErrors.length ? (
          system?.recentErrors.map((err) => (
            <li key={err.id}>
              [{new Date(err.timestamp).toLocaleString()}] {err.message}
            </li>
          ))
        ) : (
          <li>No recent errors 🎉</li>
        )}
      </ul>
    </div>
  );
}

// Recent admin/user activities
function RecentActivityList({
  activities,
}: {
  activities: { id: string; type: string; description: string; timestamp: string }[];
}) {
  return (
    <div className="rounded border border-gray-800 p-4">
      <h2 className="mb-3 text-lg font-medium">Recent Activity</h2>
      <ul className="space-y-2 text-sm text-gray-300">
        {activities.length ? (
          activities.slice(0, 8).map((a) => (
            <li
              key={a.id}
              className="rounded border border-gray-800 bg-gray-900/40 p-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.type}</span>
                <span className="text-xs text-gray-400">
                  {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400">{a.description}</p>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No recent activity</li>
        )}
      </ul>
    </div>
  );
}

// Genre distribution section
function GenreDistribution({
  genres,
}: {
  genres: ({ names: { name: string; iso_639_1: string; }[]; value: number })[];
}) {
  const { currentLanguage } = useLanguageStore();
  return (
    <div className="rounded border border-gray-800 p-4">
      <h2 className="mb-3 text-lg font-medium">Top Genres</h2>
      <ul className="space-y-2 text-sm text-gray-300">
        {genres.length ? (
          genres.slice(0, 8).map((g, i) => (
            <li
              key={'genre-distriution-key-' + i}
              className="flex items-center justify-between rounded border border-gray-800 bg-gray-900/40 p-2"
            >
              <span>{g.names?.find(n => n.iso_639_1 === currentLanguage.iso_639_1)?.name}</span>
              <span className="text-gray-400">{g.value}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No genre data available</li>
        )}
      </ul>
    </div>
  );
}
