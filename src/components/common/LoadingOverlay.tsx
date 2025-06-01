// components/LoadingOverlay.tsx
'use client';

import { useGlobalStore } from '@/zustand/global.store';

export default function LoadingOverlay() {
  const isLoading = useGlobalStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-white text-xl">Đang tải...</div>
    </div>
  );
}
