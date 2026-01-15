"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllGenres, submitFavoriteGenres, Genre } from "@/apis/genre.api";
import { useAuthStore } from "@/zustand/auth.store";
import { User } from "@/types/api.types"
import { useOverlay } from "@/hooks/overlay";
import { Loader2, Check } from "lucide-react";


export default function FavoriteGenreSelector() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGenres, setFetchingGenres] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchUser } = useAuthStore();
  const { close } = useOverlay();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres();
        setGenres(data);
      } catch (err) {
        setError("Failed to load genres");
        console.error("Error fetching genres:", err);
      } finally {
        setFetchingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (selectedGenres.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      await submitFavoriteGenres(selectedGenres);
      // Update user state
      await fetchUser();
      close();
    } catch (err) {
      setError("Failed to submit favorite genres");
      console.error("Error submitting genres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    close();
  };

  if (fetchingGenres) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Chọn thể loại yêu thích</h2>
        <p className="text-muted-foreground">
          Hãy chọn các thể loại phim bạn yêu thích để chúng tôi có thể gợi ý
          phim phù hợp hơn
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <Card
              key={genre.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-accent"
                }`}
              onClick={() => handleGenreToggle(genre.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{genre.name}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={handleSkip} disabled={loading}>
          Bỏ qua
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={selectedGenres.length === 0 || loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Xác nhận ({selectedGenres.length})
        </Button>
      </div>
    </div>
  );
}
