"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { useMyLists } from "@/hooks/useMyLists";
import { usePublicLists } from "@/hooks/usePublicLists";
import { useRecommendedLists } from "@/hooks/useRecommendedLists";
import { movieListApi } from "@/apis/movie-list.api";
import { useToast } from "@/hooks/useToast";
import { MovieList, MovieListVisibility } from "@/types/api.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Plus,
  MoreVertical,
  Globe,
  Lock,
  Trash2,
  Edit,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Reusable List Card Component
interface ListCardProps {
  list: MovieList;
  showOwner?: boolean;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

function ListCard({
  list,
  showOwner = false,
  showActions = false,
  onDelete,
}: ListCardProps) {
  const router = useRouter();

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

  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all cursor-pointer group">
      <Link href={`/lists/${list.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-gray-500 transition-colors">
              {list.name}
            </CardTitle>
            {showActions && (
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/lists/${list.id}`);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      View & Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete?.(list.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          {list.description && (
            <CardDescription className="line-clamp-2 mt-2">
              {list.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            {getVisibilityBadge(list.visibility)}
            <span className="text-sm text-gray-400">
              {list.moviesCount || 0} movie
              {(list.moviesCount || 0) !== 1 ? "s" : ""}
            </span>
          </div>
          {showOwner && list.user && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={list.user.photo_url || undefined}
                  alt={list.user.username}
                />
                <AvatarFallback className="text-xs bg-gray-800">
                  {getUserInitials(list.user.username)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-400">
                {list.user.username}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3">
          <span className="text-xs text-gray-500">
            Updated {new Date(list.updated_at).toLocaleDateString()}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
}

// Loading Skeleton Component
function ListCardSkeleton() {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-800" />
        <Skeleton className="h-4 w-full bg-gray-800" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 bg-gray-800" />
          <Skeleton className="h-4 w-20 bg-gray-800" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-32 bg-gray-800" />
      </CardFooter>
    </Card>
  );
}

// Section Header Component
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeader({ icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function MyListsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    data: myLists,
    loading: myListsLoading,
    mutate: mutateMyLists,
  } = useMyLists();
  const { data: publicListsResponse, loading: publicListsLoading } =
    usePublicLists(1, 8);
  const toast = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (listId: string) => {
    setDeletingId(listId);
    try {
      await movieListApi.remove(listId);
      toast.success("Playlist deleted successfully");
      mutateMyLists();
      setConfirmDeleteId(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete playlist"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const publicLists = publicListsResponse?.data ?? {
    data: [],
    meta: { total: 0, page: 0 },
  };
  console.log(publicLists);

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Movie Playlists</h1>
            <p className="text-gray-400">
              Discover and manage movie collections from the community
            </p>
          </div>
          {user && (
            <Link href="/lists/create">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create new list
              </Button>
            </Link>
          )}
        </div>

        {/* Section 1: My Lists (Only for authenticated users) */}
        {user && (
          <section className="mb-16">
            <SectionHeader
              icon={<Users className="w-6 h-6" />}
              title="Your Playlists"
              description="Manage your personal movie collections"
            />

            {myListsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <ListCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!myListsLoading && (!myLists || myLists.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Create your first playlist to organize your favorite movies
                </p>
                <Link href="/lists/create">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create your first playlist
                  </Button>
                </Link>
              </div>
            )}

            {!myListsLoading && myLists && myLists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myLists.map((list: MovieList) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    showActions={true}
                    onDelete={(id) => setConfirmDeleteId(id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section 2: Public Featured Lists */}
        <section className="mb-16">
          <SectionHeader
            icon={<TrendingUp className="w-6 h-6" />}
            title="Public Featured Lists"
            description="Explore popular movie collections from the community"
          />

          {publicListsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ListCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!publicListsLoading &&
            publicLists?.data?.length &&
            publicLists.data.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No public lists yet
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  Be the first to share your movie collection with the community
                </p>
              </div>
            )}

          {!publicListsLoading &&
            publicLists?.data?.length &&
            publicLists?.data.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {publicLists.data.map((list: MovieList) => (
                    <ListCard key={list.id} list={list} showOwner={true} />
                  ))}
                </div>
                {publicLists?.meta?.total > 8 && (
                  <div className="flex justify-center mt-8">
                    <Link href="/lists/public">
                      <Button variant="outline">View all public lists</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
        </section>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={confirmDeleteId !== null}
          onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete playlist?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                playlist and remove all movies from it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (confirmDeleteId) {
                    handleDelete(confirmDeleteId);
                  }
                }}
                disabled={deletingId === confirmDeleteId}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deletingId === confirmDeleteId ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
