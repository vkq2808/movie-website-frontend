import React from 'react';

export default function MovieListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded h-48" />
        ))}
      </div>
    </div>
  );
}
