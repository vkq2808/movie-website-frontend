"use client";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createComment, deleteComment, getComments, updateComment, FeedbackItem } from '@/apis/feedback.api';
import { useAuthStore } from '@/zustand/auth.store';
import { useToast } from '@/hooks/useToast';
import { sanitizeInput, isValidComment } from '@/utils/sanitize.util';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import {  checkMovieOwnership } from '@/apis/movie-purchase.api';

interface CommentsTabProps {
  movieId: string;
}

const CommentsTab: React.FC<CommentsTabProps> = ({ movieId }) => {
  const auth = useAuthStore();
  const toast = useToast();
  const currentUserId = auth.user?.id;
  const controllerRef = useRef<AbortController | null>(null);

  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [hasNewComments, setHasNewComments] = useState(false);
  const [ownsMovie, setOwnsMovie] = useState(false);
  const {user} = useAuthStore();

  const fetchData = async (p = 1) => {
    setLoading(true);
    try {
      controllerRef.current = new AbortController();
      const res = await getComments(movieId, p, limit);
      if (res.data) {
        setItems(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        if (p === 1) {
          setHasNewComments(false);
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load comments';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    return () => {
      controllerRef.current?.abort();
    };
  }, [movieId]);

  useEffect(() => {
      // Only fetch data if user is authenticated
      if (!user || !movieId) {
        return;
      }
  
      const checkInitialState = async () => {
        try {
          // Check if user owns the movie
          const ownershipResponse = await checkMovieOwnership(movieId);
          setOwnsMovie(ownershipResponse.data.owns_movie);
        } catch (error) {
        } 
      };
  
      checkInitialState();
    }, [movieId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;

    const newCommentText = sanitizeInput(newComment);

    if (!isValidComment(newCommentText)) {
      toast.error('Comment must be between 1 and 2000 characters');
      return;
    }

    const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);

    // Optimistic update - add temp comment to UI
    const tempComment: FeedbackItem = {
      id: tempId,
      feedback: newCommentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: currentUserId,
        username: user?.username || 'Unknown',
        photo_url: user?.photo_url || null,
      },
    };

    setItems((prev) => [ ...prev,tempComment]);
    setNewComment('');

    try {
      const created = await createComment(movieId, newCommentText);
      // Replace temp comment with actual comment
      setItems((prev) =>
        prev.map((item) => (item.id === tempId ? created : item))
      );
      toast.success('Comment posted successfully');
    } catch (e: unknown) {
      // Rollback on error
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      const msg = e instanceof Error ? e.message : 'Failed to post comment';
      toast.error(msg);
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
    const editedText = sanitizeInput(editingText);

    if (!isValidComment(editedText)) {
      toast.error('Comment must be between 1 and 2000 characters');
      return;
    }

    const oldItem = items.find((i) => i.id === editingId);
    if (!oldItem) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId ? { ...item, feedback: editedText } : item
      )
    );

    setEditingId(null);
    setEditingText('');

    try {
      await updateComment(editingId, editedText);
      toast.success('Comment updated successfully');
    } catch (e: unknown) {
      // Rollback on error
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, feedback: oldItem.feedback } : item
        )
      );
      const msg = e instanceof Error ? e.message : 'Failed to update comment';
      toast.error(msg);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    const oldItem = items.find((i) => i.id === id);
    if (!oldItem) return;

    // Optimistic update - hide comment immediately
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await deleteComment(id);
      toast.success('Comment deleted successfully');
    } catch (e: unknown) {
      // Rollback on error
      setItems((prev) => [...prev, oldItem]);
      const msg = e instanceof Error ? e.message : 'Failed to delete comment';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Post form */}
      <div className="bg-gray-900 p-4 rounded-lg">
        {auth.user ?(
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              disabled={!ownsMovie  }
              onChange={(e) => setNewComment(e.target.value)}
              className={`w-full ${(!ownsMovie ) && 'bg-gray-600 cursor-not-allowed'} bg-gray-800 text-white p-3 rounded-md outline-none border border-gray-700 focus:border-yellow-400 min-h-[80px]`}
              placeholder={ownsMovie?"Viết bình luận của bạn...":"Hãy sở hữu phim trước khi bình luận"}
            />
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={!ownsMovie}
                className={`px-4 py-2 rounded-md ${ownsMovie? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-700 cursor-not-allowed'} text-black`}
              >
                Gửi
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400">Vui lòng đăng nhập để bình luận.</p>
        )}
      </div>

      {/* New comments badge */}
      {hasNewComments && page > 1 && (
        <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 p-3 rounded-lg text-center">
          Có bình luận mới — <button
            onClick={() => { setPage(1); fetchData(1); }}
            className="underline hover:text-yellow-200"
          >
            xem tại trang 1
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}
        {!loading && items.length === 0 && <p className="text-gray-400">Chưa có bình luận nào</p>}

        {items.map((item) => (
          <div key={item.id} className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-sm">
                {item.user?.photo_url ? (
                  <Image src={item.user?.photo_url} alt={item.user?.username ?? 'Unknown'} width={40} height={40} className="object-cover" />
                ) : (
                  <span className="text-gray-300">{item.user?.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium">{item.user?.username}</p>
                  {currentUserId === item.user?.id && (
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
                )  : item.user?.id === currentUserId ? (
                  <p className={`${item.status && item.status === 'hidden' ? 'text-gray-500' : 'text-gray-300'} mt-2 whitespace-pre-wrap`}>{item.feedback} {`${item.status && item.status === 'hidden' ? (<span className="text-red-500"> - Đã ẩn</span>) : ''}`}</p>
                ) : (<></>)}
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
