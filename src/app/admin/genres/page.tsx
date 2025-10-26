"use client";
import React from "react";
import { adminApi, type AdminGenre } from "@/apis/admin.api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Plus, Edit, Trash2, Languages } from "lucide-react";
import { useToast } from "@/contexts/toast.context";
import { GenreModal } from "@/components/admin/GenreModal/GenreModal";

export default function AdminGenresPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [genres, setGenres] = React.useState<AdminGenre[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [workingId, setWorkingId] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [editGenre, setEditGenre] = React.useState<AdminGenre | null>(null);
  const toast = useToast();

  // ✅ debounce search
  const searchDebounceRef = React.useRef<NodeJS.Timeout>(null);
  React.useEffect(() => {
    if (!searchDebounceRef.current) return;
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      load();
    }, 500);
  }, [search, page, limit]);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGenres();
      if (res.success && res.data) {
        const fitleredData = search ? res.data.filter(g => g.names.some(n => n.name.includes(search) || n.iso_639_1.includes(search))) : res.data
        setGenres(fitleredData.slice((page - 1) * limit, page * limit - 1));
        setTotal(fitleredData.length);
      } else {
        setError(res.message || "Failed to load genres");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load genres";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const openCreate = () => {
    setEditGenre(null);
    setShowModal(true);
  };

  const openEdit = (g: AdminGenre) => {
    setEditGenre(g);
    setShowModal(true);
  };

  const deleteGenre = async (g: AdminGenre) => {
    const ok = window.confirm(`Delete genre "${g.names[0]?.name}"?`);
    if (!ok) return;
    try {
      setWorkingId(g.id);
      await adminApi.deleteGenre(g.id);
      toast.success("Deleted successfully");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setWorkingId(null);
    }
  };

  const handleSave = async (formData: AdminGenre["names"]) => {
    try {
      setLoading(true);
      if (editGenre) {
        await adminApi.updateGenre(editGenre.id, { names: formData });
        toast.success("Updated genre successfully");
      } else {
        await adminApi.createGenre({ names: formData });
        toast.success("Created genre successfully");
      }
      setShowModal(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save genre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Genres</h1>
          <p className="mt-1 text-sm text-gray-400">Manage genres metadata for movies</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search genre..."
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500"
          />
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500"
          >
            <Plus size={16} /> Add Genre
          </button>
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
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Names</th>
                <th className="px-3 py-2 w-[200px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g.id} className="border-b border-gray-800">
                  <td className="px-3 py-2 text-gray-400">{g.id}</td>
                  <td className="px-3 py-2">
                    <ul className="text-gray-200">
                      {g.names.map((n) => (
                        <li key={n.iso_639_1}>
                          <Languages size={12} className="inline mr-1 text-gray-400" />
                          <span className="text-gray-300">{n.iso_639_1.toUpperCase()}:</span> {n.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => openEdit(g)}
                      disabled={workingId === g.id}
                      className="mr-2 rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-500"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteGenre(g)}
                      disabled={workingId === g.id}
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {genres.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-gray-400">
                    No genres found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Page {page} / {totalPages}</div>
            <div className="flex gap-2 items-center">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-200 disabled:opacity-50"
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
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal thêm/sửa */}
      {showModal && (
        <GenreModal
          open={showModal}
          onClose={() => setShowModal(false)}
          genre={editGenre}
          onSave={handleSave}
        />
      )}
    </>
  );
}
