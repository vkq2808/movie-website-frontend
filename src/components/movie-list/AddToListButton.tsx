"use client";
import React, { useState, useEffect } from "react";
import { movieListApi } from "@/apis/movie-list.api";
import { isAuthenticated } from "@/utils/auth.util";
import { useSWRConfig } from "swr";
import { useToast } from "@/hooks/useToast";
import { PlusCircle, Lock, Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export default function AddToListButton({ movieId }: { movieId: string }) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();
  const toast = useToast();
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const [creatingName, setCreatingName] = useState("");
  const [creatingVisibility, setCreatingVisibility] = useState<
    "PRIVATE" | "PUBLIC"
  >("PRIVATE");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setLoading(true);
    movieListApi
      .getMyLists()
      .then((res) => {
        if (!mounted) return;
        // normalize to array of lists with checked flag
        const items = (res || []).map((l: any) => ({
          ...l,
          checked: !!(l.items || []).find(
            (it: any) => it.movie?.id === movieId
          ),
        }));
        setLists(items);
      })
      .catch((err) => setError(err.message || "Failed to load lists"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [open, movieId]);

  const ensureAuth = () => {
    if (!isAuthenticated()) {
      // attempt to redirect to login page
      window.location.href = "/auth/login";
      return false;
    }
    return true;
  };

  const toggle = async (listId: string, checked: boolean) => {
    if (!ensureAuth()) return;
    setError(null);
    setLoadingIds((s) => ({ ...s, [listId]: true }));
    try {
      if (!checked) {
        await movieListApi.addMovie(listId, { movieId });
      } else {
        await movieListApi.removeMovie(listId, movieId);
      }
      // refresh user lists and the specific movie-list detail
      mutate("/movie-lists/me");
      mutate(`/movie-lists/${listId}`);
      // update local UI
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, checked: !checked } : l))
      );
      toast.success(!checked ? "Added to list" : "Removed from list");
    } catch (err: any) {
      setError(err?.message || "Action failed");
      toast.error(err?.message || "Action failed");
    } finally {
      setLoadingIds((s) => ({ ...s, [listId]: false }));
    }
  };

  const handleCreateAndAdd = async () => {
    if (!ensureAuth()) return;
    if (!creatingName || creatingName.trim().length === 0)
      return toast.error("Name is required");
    if (creatingName.length > 100) return toast.error("Name is too long");

    setCreating(true);
    try {
      const payload = {
        name: creatingName.trim(),
        visibility: creatingVisibility,
        movieId,
      } as any;
      const created = await movieListApi.createAndAdd(payload);
      // refresh lists
      mutate("/movie-lists/me");
      mutate(`/movie-lists/${created.id}`);
      setLists((prev) => [...prev, { ...created, checked: true }]);
      setCreatingName("");
      toast.success("Playlist created and movie added");
      setOpen(false);
    } catch (err: any) {
      const msg = err?.message || "Create failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <button
        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        onClick={() => (window.location.href = "/auth/login")}
        aria-label="Add to list - login required"
      >
        <PlusCircle className="w-5 h-5 text-yellow-300" />
      </button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v && !isAuthenticated()) {
          window.location.href = "/auth/login";
          return;
        }
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Add to playlist"
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 text-yellow-300" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm vào danh sách phát</DialogTitle>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-1 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">
              Danh sách phát của bạn
            </div>
            <div className="h-48">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-2 p-1">
                  {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh
                      sách phát...
                    </div>
                  )}

                  {!loading && lists.length === 0 && (
                    <div className="text-sm text-gray-600">
                      You don&apos;t have any playlists yet.
                    </div>
                  )}

                  {lists.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-accent/40 transition-colors"
                    >
                      <input
                        aria-label={`Add to ${l.name}`}
                        type="checkbox"
                        className="h-4 w-4"
                        checked={!!l.checked}
                        disabled={!!l.checked || !!loadingIds[l.id]}
                        onChange={() => toggle(l.id, !!l.checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {l.description}
                        </div>
                      </div>
                      <div className="ml-2">
                        {l.visibility === "PRIVATE" ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Globe className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-2 text-xs text-green-600">
                        {l.checked && "✓ Added"}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Create new playlist</div>
            <Label className="text-xs">Name</Label>
            <Input
              value={creatingName}
              onChange={(e) => setCreatingName(e.target.value)}
              placeholder="Tên danh sách phát"
              className="mb-2"
            />

            <Label className="text-xs">Visibility</Label>
            <div className="flex items-center gap-4 my-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="visibility"
                  value="PRIVATE"
                  checked={creatingVisibility === "PRIVATE"}
                  onChange={() => setCreatingVisibility("PRIVATE")}
                />
                <span className="text-sm">Private</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="visibility"
                  value="PUBLIC"
                  checked={creatingVisibility === "PUBLIC"}
                  onChange={() => setCreatingVisibility("PUBLIC")}
                />
                <span className="text-sm">Public</span>
              </label>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAndAdd} disabled={creating}>
                {creating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  "Create & Add"
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <button aria-label="Close dialog" className="sr-only">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
