// app/movie/[id]/@panel/(..)update/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import MovieForm, { type MovieFormValues } from "@/components/admin/MovieForm/MovieForm";
import { adminApi } from "@/apis/admin.api";
import LoadingSpinner from "@/components/common/Loading/LoadingSpinner";
import { MovieStatus } from "@/constants/enum";
import movieApi from "@/apis/movie.api";

export default function UpdatePanel() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [initial, setInitial] = React.useState<MovieFormValues>({
    id: "",
    title: "",
    overview: "",
    cast: [],
    crew: [],
    original_language: {
      id: '',
      name: '',
      iso_639_1: ''
    },
    status: MovieStatus.DRAFT,
    price: 0,
    genres: [],
    keywords: [],
    spoken_languages: [],
    production_companies: [],
    backdrops: [],
    posters: [],
    release_date: "",
    videos: []
  });

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await adminApi.getMovie(id);
        if (!mounted) return;

        if (!(res.success && res.data)) {
          setError(res.message || "Failed to load movie");
          return;
        }

        const m = res.data;
        const results = await Promise.allSettled([
          movieApi.getMovieVideos(id),
          movieApi.getMovieGenres(id),
          movieApi.getMovieCast(id),
          movieApi.getMovieCrew(id),
          movieApi.getMovieProductionCompanies(id),
          movieApi.getMovieKeywords(id),
          movieApi.getMovieSpokenLanguages(id),
        ]);

        if (!mounted) return;

        // gom dữ liệu lại
        const [
          videosRes,
          genresRes,
          castRes,
          crewRes,
          prodRes,
          keywordsRes,
          spokenRes,
        ] = results;

        const newData = {
          id: m.id,
          title: m.title,
          overview: m.overview,
          status: m.status,
          price: m.price,
          release_date: "",
          original_language: m.original_language,
          videos:
            videosRes.status === "fulfilled" ? videosRes.value.data : [],
          genres:
            genresRes.status === "fulfilled" ? genresRes.value.data : [],
          cast:
            castRes.status === "fulfilled" ? castRes.value.data.cast : [],
          crew:
            crewRes.status === "fulfilled" ? crewRes.value.data.crew : [],
          production_companies:
            prodRes.status === "fulfilled"
              ? prodRes.value.data.production_companies
              : [],
          keywords:
            keywordsRes.status === "fulfilled"
              ? keywordsRes.value.data.keywords
              : [],
          spoken_languages:
            spokenRes.status === "fulfilled"
              ? spokenRes.value.data.spoken_languages
              : [],
        };

        setInitial(prev => ({ ...prev, ...newData }));
      } catch (err) {
        console.error("Error loading movie details for update modal:", err);
        setError("Failed to load movie");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleClose = () => {
    router.back();
  }

  const handleSubmit = async (values: MovieFormValues) => {
    try {
      setSubmitting(true);
      const cast = values.cast.map(c => ({ ...c, person_id: c.person.id }));
      const crew = values.crew.map(c => ({ ...c, person_id: c.person.id }));

      const savingValues = {
        ...values,
        cast,
        crew,
      };

      await adminApi.updateMovie(id, savingValues);

      // 🔙 Đóng modal
      handleClose();
      // 🔄 Refresh dữ liệu của Server Component cha
      router.refresh();

    } catch {
      setError("Failed to save movie");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[720px] max-h-[90vh] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {"Update Movie"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-100 hover:bg-gray-600"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="rounded border border-red-800 bg-red-900/30 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <MovieForm
            initialValues={initial!}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
