import React from 'react';

export default function MovieListEmpty({
  message = 'No lists yet',
  cta,
}: {
  message?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="text-6xl">🎬</div>
      <div className="text-lg text-gray-600">{message}</div>
      {cta}
    </div>
  );
}
