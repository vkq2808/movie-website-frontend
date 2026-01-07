/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/Loading/LoadingSpinner";
import { adminApi } from "@/apis/admin.api";
import movieApi from "@/apis/movie.api";
import Link from "next/link";
import { useLanguageStore } from "@/zustand";
import VideoCard from "@/components/ui/VideoCard";
import Image from "next/image";

export default function AdminMovieDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const id = params?.id as string;
  const { currentLanguage } = useLanguageStore();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [movie, setMovie] = React.useState<
    import("@/apis/admin.api").AdminMovie | null
  >(null);

  // Hàm load movie
  const fetchMovie = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch base admin movie data
      const res = await adminApi.getMovie(id);
      if (!(res.success && res.data)) {
        setError(res.message || "Failed to load movie");
        return;
      }

      const baseMovie = res.data;

      // Fetch supplemental resources in parallel (new split-backend design)
      const [videosRes, genresRes, castRes] = await Promise.all([
        movieApi
          .getMovieVideos(id)
          .catch((e) => ({ success: false, data: [] } as any)),
        movieApi
          .getMovieGenres(id)
          .catch((e) => ({ success: false, data: [] } as any)),
        movieApi
          .getMovieCast(id)
          .catch((e) => ({ success: false, data: [] } as any)),
      ]);

      // Merge into AdminMovie shape (prefer admin data when available)
      const merged: typeof baseMovie = {
        ...baseMovie,
        videos: videosRes?.data || baseMovie.videos || [],
        genres: genresRes?.data || baseMovie.genres || [],
        cast: castRes?.data || baseMovie.cast || [],
      };

      setMovie(merged as any);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load movie";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Gọi fetchMovie khi id thay đổi
  React.useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  // 🔥 Quan sát pathname — nếu quay lại từ /update → / thì reload
  const previousPath = React.useRef<string>(pathname);
  React.useEffect(() => {
    const prev = previousPath.current;
    // Nếu trước đó là trang /update, và giờ quay lại /[id], thì reload
    if (prev.endsWith("/update") && !pathname.endsWith("/update")) {
      fetchMovie();
    }
    previousPath.current = pathname;
  }, [pathname, fetchMovie]);

  if (loading)
    return (
      <div className="flex w-full justify-center py-10">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="p-4">
        <div className="rounded border border-red-700 bg-red-900/40 p-3 text-red-200">
          {error}
        </div>
        <button
          onClick={fetchMovie}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Retry
        </button>
      </div>
    );

  if (!movie) return null;

  return (
    <div className="flex w-full flex-col gap-6 p-4 text-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <span
              className={`rounded px-2 py-0.5 text-xs ${
                movie.status === "published"
                  ? "bg-green-800/40 text-green-200"
                  : "bg-yellow-800/40 text-yellow-200"
              }`}
            >
              {movie.status}
            </span>
            <span>Release: {movie.release_date?.slice(0, 10) || "—"}</span>
            <span>| Original ID: {movie.original_id}</span>
          </div>
        </div>
        <Link
          href={`/admin/movies/${movie.id}/update`}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
        >
          Edit
        </Link>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <p className="mt-1 whitespace-pre-wrap text-sm">
          {movie.overview || "—"}
        </p>
      </section>

      {/* Images */}
      <section>
        <h2 className="text-lg font-semibold text-white">Images</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
          <ImageGrid
            title="Posters"
            images={movie.posters}
            itemsPerRow={3}
            placeholderWidth={128}
            placeholderHeight={192}
          />
          <ImageGrid
            title="Backdrops"
            images={movie.backdrops}
            itemsPerRow={2}
            placeholderWidth={224}
            placeholderHeight={128}
          />
        </div>
      </section>

      {/* Genres & Keywords */}
      <section>
        <h2 className="text-lg font-semibold text-white">Genres & Keywords</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {movie.genres?.length
            ? movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-xs"
                >
                  {
                    g.names.find(
                      (n) => n.iso_639_1 === currentLanguage.iso_639_1
                    )?.name
                  }
                </span>
              ))
            : "—"}
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-400">Keywords:</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {movie.keywords?.length
              ? movie.keywords.map((k) => (
                  <span
                    key={k.id}
                    className="rounded border border-gray-700 bg-gray-800 px-2 py-0.5 text-xs"
                  >
                    {k.name}
                  </span>
                ))
              : "—"}
          </div>
        </div>
      </section>

      {/* Production Info */}
      <section>
        <h2 className="text-lg font-semibold text-white">Production Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoList
            title="Production Companies"
            items={movie.production_companies}
          />
          <InfoList title="Languages" items={movie.spoken_languages} />
        </div>
      </section>

      {/* Cast */}
      <CastCrewSection title="Cast" list={movie.cast} type="cast" />
      <CastCrewSection title="Crew" list={movie.crew} type="crew" />

      {/* Statistics */}
      <section>
        <h2 className="text-lg font-semibold text-white">Statistics</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Stat
            label="Budget"
            value={`$${movie.budget?.toLocaleString() || "—"}`}
          />
          <Stat
            label="Revenue"
            value={`$${movie.revenue?.toLocaleString() || "—"}`}
          />
          <Stat label="Runtime" value={`${movie.runtime || "—"} min`} />
          <Stat
            label="Popularity"
            value={movie.popularity?.toFixed(1) ?? "—"}
          />
          <Stat label="Vote Average" value={movie.vote_average ?? "—"} />
          <Stat label="Vote Count" value={movie.vote_count ?? "—"} />
        </div>
      </section>

      {/* Purchases */}
      <section>
        <h2 className="text-lg font-semibold text-white">Purchases</h2>
        <div className="mt-2 space-y-2">
          {movie.purchases?.length ? (
            movie.purchases.map((p) => (
              <div
                key={p.id}
                className="rounded border border-gray-800 bg-gray-900/50 p-2 text-sm"
              >
                <div>
                  <span className="font-medium">{p.user.username}</span> (
                  {p.user.email}) purchased at{" "}
                  {new Date(p.purchased_at).toLocaleString()} for $
                  {p.purchase_price}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No purchases</div>
          )}
        </div>
      </section>

      {/* Metadata */}
      <section>
        <h2 className="text-lg font-semibold text-white">Metadata</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat
            label="Created At"
            value={movie.created_at?.toString().slice(0, 19)}
          />
          <Stat
            label="Updated At"
            value={movie.updated_at?.toString().slice(0, 19)}
          />
          <Stat
            label="Deleted At"
            value={movie.deleted_at?.toString().slice(0, 19) || "—"}
          />
          <Stat label="TMDB id" value={movie.original_id} />
        </div>
      </section>

      {/* Videos */}
      <section>
        <h2 className="text-lg font-semibold text-white">Videos</h2>
        {movie.videos?.length ? (
          <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {movie.videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-500">No videos</div>
        )}
      </section>
    </div>
  );
}

/* ---- Helper Components ---- */
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="text-sm text-gray-200">{value}</div>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items?: any[] }) {
  return (
    <div>
      <h3 className="text-sm text-gray-400">{title}</h3>
      <ul className="mt-1 list-disc pl-4">
        {items?.length ? (
          items.map((i) => <li key={i.id}>{i.name}</li>)
        ) : (
          <li>—</li>
        )}
      </ul>
    </div>
  );
}

function ImageGrid({
  title,
  images,
  itemsPerRow,
  placeholderWidth,
  placeholderHeight,
}: {
  title: string;
  images: { url: string; alt: string }[];
  itemsPerRow: number;
  placeholderWidth: number;
  placeholderHeight: number;
}) {
  const total = images.length;
  const totalSlots =
    Math.ceil(total / itemsPerRow) * itemsPerRow || itemsPerRow;

  return (
    <div className="w-full">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-3">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const img = images[i];
          return img ? (
            <Image
              key={i}
              src={img.url}
              alt={img.alt}
              className={`rounded border border-gray-700 object-cover`}
              width={placeholderWidth}
              height={placeholderHeight}
            />
          ) : (
            <div
              key={i}
              className={`flex items-center justify-center rounded border border-dashed border-gray-700 bg-gray-800 text-gray-500 text-sm`}
              style={{
                width: placeholderWidth,
                height: placeholderHeight,
              }}
            >
              Empty
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CastCrewSection({
  title,
  list,
  type,
}: {
  title: string;
  list: any[];
  type: "cast" | "crew";
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {list?.length ? (
          list.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center rounded border border-gray-800 bg-gray-900/40 p-2"
            >
              <Image
                src={item.person.profile_image?.url || "/placeholder.png"}
                alt={item.person.name}
                className="rounded object-cover"
                width={112}
                height={112}
              />
              <div className="mt-1 text-sm font-medium">{item.person.name}</div>
              <div className="text-xs text-gray-400">
                {type === "cast"
                  ? `as ${item.character || "Unknown"}`
                  : item.job}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">
            No {title.toLowerCase()} info
          </div>
        )}
      </div>
    </section>
  );
}
