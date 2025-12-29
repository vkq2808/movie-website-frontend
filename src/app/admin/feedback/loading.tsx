import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

export default function AdminFeedbackLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Feedback Management</h1>
        <p className="mt-1 text-sm text-gray-400">Review and moderate user feedback</p>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
        <div className="mb-6 space-y-2">
          <div className="h-10 w-64 animate-pulse rounded bg-gray-700" />
        </div>

        <div className="flex h-96 items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}
