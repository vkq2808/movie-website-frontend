"use client";

import { OverlayProvider, useOverlay } from "@/hooks/overlay";
import { useAuthStore } from "@/zustand";
import { useEffect } from "react";
import FavoriteGenreSelector from "./FavoriteGenreSelector";

export default function CheckHasSubmittedFavoriteGenres() {
  const { open, close } = useOverlay();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      close();
      return;
    }
    if (!user.has_submitted_favorite_genres) {
      console.log("has not submitted favorite genres");
      open({
        title: "Favorite Genres",
        content: <FavoriteGenreSelector />,
        closable: true
      });
    }
  }, [user]);

  return null;
}