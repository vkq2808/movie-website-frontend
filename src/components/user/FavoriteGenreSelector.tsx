"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllGenres, submitFavoriteGenres, Genre } from "@/apis/genre.api";
import { useAuthStore } from "@/zustand/auth.store";
import { useOverlay } from "@/hooks/overlay";
import { Loader2, Check, Film } from "lucide-react";

export default function FavoriteGenreSelector() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const { user,fetchUser } = useAuthStore();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingGenres, setFetchingGenres] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setGenres(await getAllGenres());
      } catch {
        setError("Không thể tải danh sách thể loại");
      } finally {
        setFetchingGenres(false);
      }
    })();
  }, []);

  useEffect(()=>{
    console.log(user);
    if(!genres || !genres.length || !user || !user.has_submitted_favorite_genres || !user.favorite_genres || !user.favorite_genres.length) return;
    setSelectedGenres(user.favorite_genres.map((g) => g.id));
  }, [genres, user])

  const toggleGenre = (id: string) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedGenres.length) return;
    setLoading(true);
    try {
      await submitFavoriteGenres(selectedGenres);
      await fetchUser();
      close();
    } catch {
      setError("Gửi thể loại yêu thích thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingGenres) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl border-none shadow-xl">
      {/* Header */}
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Film className="h-6 w-6 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Chọn thể loại bạn yêu thích
        </h2>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Việc này giúp hệ thống gợi ý phim sát với gu xem của bạn hơn.
        </p>
      </CardHeader>

      <Separator />

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Content */}
      <CardContent className="py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {genres.map((genre) => {
            const selected = selectedGenres.includes(genre.id);

            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={`
                  group relative rounded-lg border px-4 py-3 text-sm font-medium
                  transition-all duration-200
                  ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : "hover:border-primary/40 hover:bg-accent"
                  }
                `}
              >
                <span className="flex items-center justify-between gap-2">
                  {genre.name}
                  {selected && (
                    <Check className="h-4 w-4 shrink-0 opacity-90" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>

      <Separator />

      {/* Footer */}
      <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {selectedGenres.length > 0 ? (
            <Badge variant="secondary">
              Đã chọn {selectedGenres.length} thể loại
            </Badge>
          ) : (
            "Bạn có thể chọn nhiều thể loại"
          )}
        </div>

        <div className="flex gap-3">

          <Button
            onClick={handleSubmit}
            disabled={!selectedGenres.length || loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Xác nhận
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
