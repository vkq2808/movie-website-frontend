"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { useMovieListDetail } from "@/hooks/useMovieListDetail";
import { movieListApi } from "@/apis/movie-list.api";
import movieApi from "@/apis/movie.api";
import { useToast } from "@/hooks/useToast";
import { MovieList, MovieListVisibility, Movie } from "@/types/api.types";
import { MovieCard } from "@/components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Lock,
  Plus,
  MoreVertical,
  Trash2,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params?.id as string;
  const { user } = useAuthStore();
  const { data: list, loading, mutate } = useMovieListDetail(listId);
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const [addMovieDialogOpen, setAddMovieDialogOpen] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<string | null>(null);
  const [removingMovieId, setRemovingMovieId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user && list && list.user.id === user.id;

  // Search movies
  useEffect(() => {
    if (!searchQuery.trim() || !addMovieDialogOpen) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await movieApi.getMovies({
          title: searchQuery.trim(),
          limit: 20,
        });
        // Filter out movies already in the list
        const existingMovieIds = new Set(
          (list?.items || []).map((item) => item.movie.id)
        );
        const filtered = (response.data || []).filter(
          (movie) => !existingMovieIds.has(movie.id)
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search movies");
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, addMovieDialogOpen, list, toast]);

  const handleAddMovie = async (movieId: string) => {
    if (!listId) return;
    setAddingMovieId(movieId);
    try {
      await movieListApi.addMovie(listId, { movieId });
      toast.success("Movie added to playlist");
      mutate();
      setSearchResults((prev) => prev.filter((m) => m.id !== movieId));
      setSearchQuery("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add movie to playlist"
      );
    } finally {
      setAddingMovieId(null);
    }
  };

  const handleRemoveMovie = async (movieId: string) => {
    if (!listId) return;
    setRemovingMovieId(movieId);
    try {
      await movieListApi.removeMovie(listId, movieId);
      toast.success("Movie removed from playlist");
      mutate();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to remove movie from playlist"
      );
    } finally {
      setRemovingMovieId(null);
    }
  };

  const handleDeleteList = async () => {
    if (!listId) return;
    setDeleting(true);
    try {
      await movieListApi.remove(listId);
      toast.success("Playlist deleted successfully");
      router.push("/lists");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete playlist"
      );
      setDeleting(false);
    }
  };

  const getVisibilityBadge = (visibility: MovieListVisibility) => {
    if (visibility === MovieListVisibility.PUBLIC) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Public
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Lock className="w-3 h-3" />
        Private
      </Badge>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state - list not found
  if (!list) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Playlist Not Found</h1>
            <p className="text-gray-400 mb-8">
              The playlist you&apos;re looking for doesn&apos;t exist or you don&apos;t have
              permission to view it.
            </p>
            <Link href="/lists">
              <Button>Go to My Playlists</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const movies = list.items || [];

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/lists"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playlists
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{list.name}</h1>
                {getVisibilityBadge(list.visibility)}
              </div>
              {list.description && (
                <p className="text-gray-400 text-lg">{list.description}</p>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                <span>
                  Created by <span className="text-white">{list.user.username}</span>
                </span>
                <span>•</span>
                <span>
                  {list.moviesCount || movies.length} movie
                  {(list.moviesCount || movies.length) !== 1 ? "s" : ""}
                </span>
                <span>•</span>
                <span>
                  Updated {new Date(list.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Bar (Owner Only) */}
            {isOwner && (
              <div className="flex items-center gap-3">
                <Dialog open={addMovieDialogOpen} onOpenChange={setAddMovieDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Movie
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Add Movie to Playlist</DialogTitle>
                      <DialogDescription>
                        Search for a movie to add to this playlist
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 flex flex-col min-h-0">
                      <Input
                        placeholder="Search for a movie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex-1 overflow-y-auto">
                        {searching && (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                          </div>
                        )}
                        {!searching && searchQuery.trim() && searchResults.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            No movies found
                          </div>
                        )}
                        {!searching && !searchQuery.trim() && (
                          <div className="text-center py-12 text-gray-400">
                            Start typing to search for movies
                          </div>
                        )}
                        {!searching && searchResults.length > 0 && (
                          <div className="grid grid-cols-2 gap-4">
                            {searchResults.map((movie) => (
                              <Card
                                key={movie.id}
                                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    {movie.posters?.[0] && (
                                      <Image
                                        src={movie.posters[0].url}
                                        alt={movie.title}
                                        width={64}
                                        height={96}
                                        className="w-16 h-24 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold truncate">
                                        {movie.title}
                                      </h3>
                                      <p className="text-sm text-gray-400 line-clamp-2">
                                        {movie.overview}
                                      </p>
                                      <Button
                                        size="sm"
                                        className="mt-2 w-full"
                                        onClick={() => handleAddMovie(movie.id)}
                                        disabled={addingMovieId === movie.id}
                                      >
                                        {addingMovieId === movie.id ? (
                                          <>
                                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                            Adding...
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="w-3 h-3 mr-2" />
                                            Add
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setConfirmDeleteOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Playlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No movies yet</h2>
            <p className="text-gray-400 mb-8">
              {isOwner
                ? "Add your first movie to this playlist"
                : "This playlist doesn't have any movies yet"}
            </p>
            {isOwner && (
              <Button
                onClick={() => setAddMovieDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add your first movie
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((item) => (
              <div key={item.id} className="group relative">
                <MovieCard movie={item.movie} />
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => handleRemoveMovie(item.movie.id)}
                    disabled={removingMovieId === item.movie.id}
                  >
                    {removingMovieId === item.movie.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete playlist?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                playlist &quot;{list.name}&quot; and remove all movies from it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteList}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
