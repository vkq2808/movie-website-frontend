"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand";
import { movieListApi } from "@/apis/movie-list.api";
import { useToast } from "@/hooks/useToast";
import { MovieListVisibility } from "@/types/api.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

export default function CreateListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<MovieListVisibility>(
    MovieListVisibility.PRIVATE
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const isFormValid = name.trim().length > 0 && name.trim().length <= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError("List name is required and must be 100 characters or less");
      return;
    }

    setSubmitting(true);
    try {
      const result = await movieListApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
      });
      toast.success("Playlist created successfully!");
      router.push(`/lists/${result.id}`);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create playlist";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Playlist</CardTitle>
            <CardDescription>
              Create a new playlist to organize your favorite movies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-950/50 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {/* List Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  List Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="My Favorite Movies"
                  maxLength={100}
                  disabled={submitting}
                  className="bg-gray-800 border-gray-700"
                />
                <p className="text-xs text-gray-400">
                  {name.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A collection of my favorite movies"
                  maxLength={500}
                  disabled={submitting}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <Label>Visibility</Label>
                <RadioGroup
                  value={visibility}
                  onValueChange={(value) =>
                    setVisibility(value as MovieListVisibility)
                  }
                  disabled={submitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={MovieListVisibility.PUBLIC}
                      id="public"
                    />
                    <Label
                      htmlFor="public"
                      className="font-normal cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Public</span>
                        <span className="text-sm text-gray-400">
                          - Anyone can view this playlist
                        </span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={MovieListVisibility.PRIVATE}
                      id="private"
                    />
                    <Label
                      htmlFor="private"
                      className="font-normal cursor-pointer flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Private</span>
                        <span className="text-sm text-gray-400">
                          - Only you can view this playlist
                        </span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Playlist"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
