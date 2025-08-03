'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  UserIcon,
  TrashIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
  avatar_url?: string;
  total_purchases: number;
  total_watch_time: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: '1',
              username: 'admin_user',
              email: 'admin@moviestream.com',
              role: 'admin',
              status: 'active',
              created_at: '2023-01-01T00:00:00Z',
              last_login: '2024-01-15T10:30:00Z',
              avatar_url: '/avatars/admin.jpg',
              total_purchases: 0,
              total_watch_time: 0,
            },
            {
              id: '2',
              username: 'john_doe',
              email: 'john.doe@example.com',
              role: 'user',
              status: 'active',
              created_at: '2023-02-15T00:00:00Z',
              last_login: '2024-01-14T15:45:00Z',
              total_purchases: 5,
              total_watch_time: 125, // in hours
            },
            {
              id: '3',
              username: 'jane_smith',
              email: 'jane.smith@example.com',
              role: 'user',
              status: 'active',
              created_at: '2023-03-10T00:00:00Z',
              last_login: '2024-01-13T09:20:00Z',
              total_purchases: 12,
              total_watch_time: 287,
            },
            {
              id: '4',
              username: 'inactive_user',
              email: 'inactive@example.com',
              role: 'user',
              status: 'inactive',
              created_at: '2023-04-20T00:00:00Z',
              last_login: '2023-12-01T12:00:00Z',
              total_purchases: 2,
              total_watch_time: 45,
            },
            {
              id: '5',
              username: 'movie_lover',
              email: 'movies@example.com',
              role: 'user',
              status: 'active',
              created_at: '2023-05-05T00:00:00Z',
              last_login: '2024-01-15T20:15:00Z',
              total_purchases: 25,
              total_watch_time: 456,
            },
          ];

          setUsers(mockUsers);
          setTotalPages(Math.ceil(mockUsers.length / itemsPerPage));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        setShowActionsMenu(null);
        console.log('Changing role for user:', userId, 'to:', newRole);
      } catch (error) {
        console.error('Error changing user role:', error);
      }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this user?`)) {
      try {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        setShowActionsMenu(null);
        console.log('Changing status for user:', userId, 'to:', newStatus);
      } catch (error) {
        console.error('Error changing user status:', error);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setUsers(users.filter(user => user.id !== userId));
        setShowActionsMenu(null);
        console.log('Deleting user:', userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatWatchTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours)}h`;
  };

  if (loading) {
    return (
      <AdminLayout title="User Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar_url}
                            alt={user.username}
                            width={40}
                            height={40}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {user.role === 'admin' && <ShieldCheckIcon className="mr-1 h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.last_login ? formatDate(user.last_login) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="space-y-1">
                      <div>{user.total_purchases} purchases</div>
                      <div>{formatWatchTime(user.total_watch_time)} watched</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>

                      {showActionsMenu === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10 border border-gray-600">
                          <div className="py-1">
                            <button
                              onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                            >
                              <ShieldCheckIcon className="mr-3 h-4 w-4" />
                              {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            <button
                              onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                            >
                              <NoSymbolIcon className="mr-3 h-4 w-4" />
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
                            >
                              <TrashIcon className="mr-3 h-4 w-4" />
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        } ${pageNum === 1 ? 'rounded-l-md' : ''
                        } ${pageNum === totalPages ? 'rounded-r-md' : ''
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-300">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'No users have registered yet.'}
          </p>
        </div>
      )}

      {/* Click outside to close menu */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionsMenu(null)}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
