"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { createComment, deleteComment, getComments, updateComment, FeedbackItem } from '@/apis/feedback.api';
import { useAuthStore } from '@/zustand/auth.store';

interface CommentsTabProps {
  movieId: string;
}

const CommentsTab: React.FC<CommentsTabProps> = ({ movieId }) => {
  const auth = useAuthStore();
  const currentUserId = auth.user?.id;

  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const canPost = useMemo(() => !!auth.user && newComment.trim().length > 0, [auth.user, newComment]);

  const fetchData = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getComments(movieId, p, limit);
      setItems(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load comments';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    try {
      const res = await createComment(movieId, newComment.trim());
      setNewComment('');
      // Refresh to first page to show newest first
      fetchData(1);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to post comment';
      setError(msg);
    }
  };

  const startEdit = (item: FeedbackItem) => {
    setEditingId(item.id);
    setEditingText(item.feedback);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateComment(editingId, editingText.trim());
      setEditingId(null);
      setEditingText('');
      fetchData(page);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update comment';
      setError(msg);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteComment(id);
      fetchData(page);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete comment';
      setError(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Post form */}
      <div className="bg-gray-900 p-4 rounded-lg">
        {auth.user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-md outline-none border border-gray-700 focus:border-yellow-400 min-h-[80px]"
              placeholder="Viết bình luận của bạn..."
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!canPost}
                className={`px-4 py-2 rounded-md ${canPost ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 cursor-not-allowed'} text-black`}
              >
                Gửi
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400">Vui lòng đăng nhập để bình luận.</p>
        )}
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Đang tải bình luận...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && items.length === 0 && <p className="text-gray-400">Chưa có bình luận nào</p>}

        {items.map((item) => (
          <div key={item.id} className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-sm">
                {item.user.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.user.photo_url} alt={item.user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300">{item.user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{item.user.username}</p>
                  {currentUserId === item.user.id && (
                    <div className="space-x-2 text-sm">
                      {editingId === item.id ? (
                        <>
                          <button onClick={saveEdit} className="text-yellow-400 hover:underline">Lưu</button>
                          <button onClick={cancelEdit} className="text-gray-400 hover:underline">Hủy</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(item)} className="text-blue-400 hover:underline">Sửa</button>
                          <button onClick={() => remove(item.id)} className="text-red-400 hover:underline">Xóa</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {editingId === item.id ? (
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full bg-gray-800 text-white p-3 mt-2 rounded-md outline-none border border-gray-700 focus:border-yellow-400"
                  />
                ) : (
                  <p className="text-gray-300 mt-2 whitespace-pre-wrap">{item.feedback}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{new Date(item.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => { setPage((p) => Math.max(1, p - 1)); fetchData(Math.max(1, page - 1)); }}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
          >
            Trước
          </button>
          <span className="text-gray-300">{page} / {totalPages}</span>
          <button
            onClick={() => { const np = Math.min(totalPages, page + 1); setPage(np); fetchData(np); }}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsTab;
