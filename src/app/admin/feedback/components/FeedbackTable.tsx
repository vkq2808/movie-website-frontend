"use client";
import React from 'react';
import { AdminFeedback } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';
import { adminApi } from '@/apis/admin.api';

interface FeedbackTableProps {
  feedbacks: AdminFeedback[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export function FeedbackTable({ feedbacks, isLoading, onRefresh }: FeedbackTableProps) {
  const toast = useToast();
  const [hidingId, setHidingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  const handleToggleHide = async (id: string, currentStatus: string) => {
    setHidingId(id);
    try {
      if (currentStatus === 'hidden') {
        await adminApi.unhideFeedback(id);
        toast.success('Feedback unhidden');
      } else {
        await adminApi.hideFeedback(id);
        toast.success('Feedback hidden');
      }
      await onRefresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update feedback';
      toast.error(msg);
    } finally {
      setHidingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    // Two-step confirmation: first click sets confirmingId, second click proceeds
    if (confirmingId !== id) {
      setConfirmingId(id);
      // Auto-reset after 5s
      setTimeout(() => setConfirmingId((cur) => (cur === id ? null : cur)), 5000);
      return;
    }

    setDeletingId(id);
    try {
      toast.info('Deleting feedback...', { duration: 3000 });
      await adminApi.deleteFeedback(id);
      toast.success('Feedback deleted');
      await onRefresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete feedback';
      toast.error(msg);
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  // Truncate feedback text for table view
  const truncateFeedback = (text: string, length = 100) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">Movie</th>
            <th className="px-3 py-2">Feedback</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={6} className="flex h-56 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id} className="border-b border-gray-800">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {fb.user?.avatar && (
                      <img
                        src={fb.user.avatar}
                        alt={fb.user.fullName || 'User'}
                        className="h-6 w-6 rounded-full bg-gray-800 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-gray-100">
                      {fb.user?.fullName || 'Unknown User'}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-300">
                  {fb.movie?.title || 'Unknown Movie'}
                </td>
                <td className="px-3 py-2 max-w-xs text-gray-300">
                  <span title={fb.feedback}>
                    {truncateFeedback(fb.feedback)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      'rounded px-2 py-1 text-xs ' +
                      (fb.status === 'active'
                        ? 'bg-green-500/10 text-green-300'
                        : fb.status === 'hidden'
                          ? 'bg-yellow-500/10 text-yellow-300'
                          : 'bg-red-500/10 text-red-300')
                    }
                  >
                    {fb.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-400 text-xs">
                  {new Date(fb.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleToggleHide(fb.id, fb.status)}
                      disabled={hidingId === fb.id}
                      className={`rounded px-3 py-1 text-xs text-white ${hidingId === fb.id
                          ? 'bg-orange-400/60'
                          : 'bg-orange-600 hover:bg-orange-500'
                        }`}
                      title={fb.status === 'hidden' ? 'Unhide this feedback' : 'Hide this feedback'}
                    >
                      {hidingId === fb.id
                        ? 'Updating...'
                        : fb.status === 'hidden'
                          ? 'Unhide'
                          : 'Hide'}
                    </button>
                    <button
                      onClick={() => handleDelete(fb.id)}
                      disabled={deletingId === fb.id}
                      className={`rounded px-3 py-1 text-xs text-white ${deletingId === fb.id
                          ? 'bg-red-400/60'
                          : 'bg-red-600 hover:bg-red-500'
                        }`}
                    >
                      {deletingId === fb.id
                        ? 'Deleting...'
                        : confirmingId === fb.id
                          ? 'Confirm'
                          : 'Delete'}
                    </button>
                    {confirmingId === fb.id && (
                      <button
                        onClick={() => setConfirmingId(null)}
                        className="rounded border border-gray-700 px-2 py-1 text-xs text-gray-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-400" colSpan={6}>
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}
