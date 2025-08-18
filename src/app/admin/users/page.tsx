"use client";
import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminApi, type AdminUser } from '@/apis/admin.api';

export default function AdminUsersPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [role, setRole] = React.useState<'all' | 'admin' | 'user'>('all');
  const [status, setStatus] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [workingId, setWorkingId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ page, limit, search: search || undefined, role, status });
      if (res.success && res.data) {
        setUsers(res.data.users);
        setTotal(res.data.total);
      } else {
        setError(res.message || 'Failed to load users');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const toggleRole = async (u: AdminUser) => {
    try {
      setWorkingId(u.id);
      const nextRole = u.role === 'admin' ? 'user' : 'admin';
      await adminApi.updateUser(u.id, { role: nextRole });
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update role');
    } finally {
      setWorkingId(null);
    }
  };

  const toggleStatus = async (u: AdminUser) => {
    try {
      setWorkingId(u.id);
      const nextStatus = u.status === 'active' ? 'inactive' : 'active';
      await adminApi.updateUser(u.id, { status: nextStatus });
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setWorkingId(null);
    }
  };

  const deleteUser = async (u: AdminUser) => {
    const ok = window.confirm(`Delete user ${u.username || u.email}? This cannot be undone.`);
    if (!ok) return;
    try {
      setWorkingId(u.id);
      await adminApi.deleteUser(u.id);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete user');
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-gray-400">Manage platform users, roles, and status</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500 md:w-64"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.currentTarget.value as typeof role)}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.currentTarget.value as typeof status)}
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center"><LoadingSpinner /></div>
      ) : error ? (
        <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Joined</th>
                <th className="px-3 py-2">Last Login</th>
                <th className="px-3 py-2">Purchases</th>
                <th className="px-3 py-2">Watch Time</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800">
                  <td className="px-3 py-2 font-medium text-gray-100">{u.username || '-'}</td>
                  <td className="px-3 py-2 text-gray-300">{u.email}</td>
                  <td className="px-3 py-2">
                    <span className={
                      'rounded px-2 py-1 text-xs ' +
                      (u.role === 'admin' ? 'bg-purple-500/10 text-purple-300' : 'bg-gray-500/10 text-gray-300')
                    }>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={
                      'rounded px-2 py-1 text-xs ' +
                      (u.status === 'active' ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300')
                    }>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-300">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-gray-300">{u.last_login ? new Date(u.last_login).toLocaleString() : '-'}</td>
                  <td className="px-3 py-2 text-gray-300">{u.total_purchases ?? 0}</td>
                  <td className="px-3 py-2 text-gray-300">{u.total_watch_time ?? 0}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={workingId === u.id}
                      className="mr-2 rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={workingId === u.id}
                      className="mr-2 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={workingId === u.id}
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-400" colSpan={9}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Page {page} of {totalPages} • {total} total</div>
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
                onChange={(e) => { setLimit(Number(e.currentTarget.value)); setPage(1); }}
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
