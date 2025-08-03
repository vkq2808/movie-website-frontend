'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FilmIcon, UsersIcon, EyeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalMovies: number;
  totalViews: number;
  newUsersThisWeek: number;
}

interface MovieStats {
  id: string;
  title: string;
  views: number;
}

interface ChartData {
  name: string;
  value: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMovies: 0,
    totalViews: 0,
    newUsersThisWeek: 0,
  });

  const [mostWatchedMovies, setMostWatchedMovies] = useState<MovieStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls with mock data
        setTimeout(() => {
          setStats({
            totalUsers: 1234,
            totalMovies: 856,
            totalViews: 45678,
            newUsersThisWeek: 23,
          });

          setMostWatchedMovies([
            { id: '1', title: 'Avengers: Endgame', views: 5432 },
            { id: '2', title: 'Spider-Man: No Way Home', views: 4321 },
            { id: '3', title: 'The Batman', views: 3456 },
            { id: '4', title: 'Top Gun: Maverick', views: 2987 },
            { id: '5', title: 'Doctor Strange 2', views: 2654 },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userGrowthData: ChartData[] = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 350 },
    { name: 'Jun', value: 420 },
    { name: 'Jul', value: 500 },
  ];

  const genreDistribution: ChartData[] = [
    { name: 'Action', value: 35 },
    { name: 'Comedy', value: 25 },
    { name: 'Drama', value: 20 },
    { name: 'Horror', value: 12 },
    { name: 'Sci-Fi', value: 8 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    change?: string;
    changeType?: 'positive' | 'negative';
  }> = ({ title, value, icon: Icon, change, changeType = 'positive' }) => (
    <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">{title}</dt>
              <dd className="text-lg font-medium text-white">{value.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-3">
            <span className={`text-sm font-medium ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          change="+12% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Movies"
          value={stats.totalMovies}
          icon={FilmIcon}
          change="+5% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon={EyeIcon}
          change="+18% from last month"
          changeType="positive"
        />
        <StatCard
          title="New Users This Week"
          value={stats.newUsersThisWeek}
          icon={ChartBarIcon}
          change="+3% from last week"
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-white mb-4">User Growth (Last 7 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-white mb-4">Movies by Genre</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Watched Movies */}
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Most Watched Movies</h3>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostWatchedMovies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="title" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="views" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">New user registration: john.doe@example.com</span>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Movie added: &ldquo;The Latest Blockbuster&rdquo;</span>
              <span className="text-sm text-gray-500">15 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">User role updated: admin privileges granted</span>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-300">Movie removed: &ldquo;Outdated Content&rdquo;</span>
              <span className="text-sm text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
