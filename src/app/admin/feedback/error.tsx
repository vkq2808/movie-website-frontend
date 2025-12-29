'use client';

import { useEffect } from 'react';

export default function AdminFeedbackError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Feedback page error:', error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feedback Management</h1>
        <p className="mt-1 text-sm text-gray-400">Review and moderate user feedback</p>
      </div>

      <div className="rounded bg-red-500/10 p-4 text-sm text-red-300">
        <p className="font-semibold">Something went wrong</p>
        <p className="mt-1 text-xs">{error.message || 'Failed to load feedback page'}</p>
        <button
          onClick={reset}
          className="mt-3 rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
