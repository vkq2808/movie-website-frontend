"use client";
import React from "react";
import { adminApi, type AdminUser } from "@/apis/admin.api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { Eye, Lock, LockOpen, Trash2, UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<"all" | "admin" | "user">("all");
  const [status, setStatus] = React.useState<"all" | "active" | "inactive">("all");
  const [workingId, setWorkingId] = React.useState<string | null>(null);
  const [activeCount, setActiveCount] = React.useState(0);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const searchRef = React.useRef<NodeJS.Timeout | null>(null);

  // 🔹 Debounce search
  React.useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      load();
    }, 500);
  }, [search, role, status, page, limit]);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers({ page, limit, search, role, status });
      if (res.success && res.data) {
        setUsers(res.data.users);
        setTotal(res.data.total);
        const active = res.data.users.filter((u: AdminUser) => u.status === "active").length;
        setActiveCount(active);
      } else {
        setError(res.message || "Failed to load users");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load users";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role, status]);

  React.useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const toggleRole = async (u: AdminUser) => {
    try {
      setWorkingId(u.id);
      const nextRole = u.role === "admin" ? "user" : "admin";
      await adminApi.updateUser(u.id, { role: nextRole });
      toast.success(`Updated ${u.email} to ${nextRole}`);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setWorkingId(null);
    }
  };

  const toggleStatus = async (u: AdminUser) => {
    try {
      setWorkingId(u.id);
      const nextStatus = u.status === "active" ? "inactive" : "active";
      await adminApi.updateUser(u.id, { status: nextStatus });
      toast.success(`${u.email} is now ${nextStatus}`);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setWorkingId(null);
    }
  };

  const deleteUser = async (u: AdminUser) => {
    const ok = window.confirm(`Delete user ${u.username || u.email}?`);
    if (!ok) return;
    try {
      setWorkingId(u.id);
      await adminApi.deleteUser(u.id);
      toast.success(`Deleted ${u.email}`);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <>
      {/* Toast container */}
      <div id="toast-root">
        {/* react-hot-toast hiển thị tự động, không cần thêm Toaster ở đây nếu đã đặt global */}
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users Management</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage users, roles, and account status
          </p>
          <p className="mt-2 text-sm text-gray-300">
            👥 Total: <b>{total}</b> • 🟢 Active: <b>{activeCount}</b>
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by username or email..."
            className="w-full md:w-64"
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
        <div className="flex h-56 items-center justify-center">
          <LoadingSpinner />
        </div>
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
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800">
                  <td className="px-3 py-2 font-medium text-gray-100">
                    {u.username || "-"}
                  </td>
                  <td
                    className="px-3 py-2 text-blue-400 hover:underline cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    {u.email}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        "rounded px-2 py-1 text-xs " +
                        (u.role === "admin"
                          ? "bg-purple-500/10 text-purple-300"
                          : "bg-gray-500/10 text-gray-300")
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        "rounded px-2 py-1 text-xs " +
                        (u.status === "active"
                          ? "bg-green-500/10 text-green-300"
                          : "bg-yellow-500/10 text-yellow-300")
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={workingId === u.id}
                      className="rounded bg-indigo-600 p-1 text-white hover:bg-indigo-500 disabled:opacity-60"
                      title="Change Role"
                    >
                      <UserCog size={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={workingId === u.id}
                      className="rounded bg-blue-600 p-1 text-white hover:bg-blue-500 disabled:opacity-60"
                      title="Toggle Status"
                    >
                      {u.status === "active" ? <Lock size={16} /> : <LockOpen size={16} />}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      disabled={workingId === u.id}
                      className="rounded bg-red-600 p-1 text-white hover:bg-red-500 disabled:opacity-60"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="rounded bg-gray-700 p-1 text-white hover:bg-gray-600"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-6 text-center text-gray-400"
                    colSpan={9}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
        </div>
      )}

      {/* Modal xem chi tiết người dùng */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-gray-900">
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Username:</b> {selectedUser.username || "-"}</p>
              <p><b>Role:</b> {selectedUser.role}</p>
              <p><b>Status:</b> {selectedUser.status}</p>
              <p><b>Joined:</b> {new Date(selectedUser.created_at).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
