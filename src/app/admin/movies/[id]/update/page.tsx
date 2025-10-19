'use client'

// app/admin/movies/[id]/update/page.tsx
import MovieDetailPage from "../page"; // page cha
import UpdateModal from "../../@modal/(..)movies/[id]/update/page"; // modal overlay
import { useParams } from "next/navigation";

export default function UpdateStandalone() {
  const params = useParams<{ id: string }>();

  return (
    <div className="relative">
      {/* Background = trang chi tiết */}
      <MovieDetailPage />

      {/* Overlay */}
      <div className="fixed inset-0 z-50">
        <UpdateModal />
      </div>
    </div>
  );
}
