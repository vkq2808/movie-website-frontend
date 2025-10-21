'use client'

import CreateModal from "../@modal/(..)movies/create/page"; // modal overlay
import AdminMoviesPage from "../page"
import { useParams } from "next/navigation";

export default function UpdateStandalone() {
  const params = useParams<{ id: string }>();

  return (
    <div className="relative">

      <AdminMoviesPage />

      {/* Overlay */}
      <div className="fixed inset-0 z-50">
        <CreateModal />
      </div>
    </div>
  );
}
