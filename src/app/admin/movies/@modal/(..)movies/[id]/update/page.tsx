// app/movie/[id]/@panel/(..)update/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import MovieForm, { type MovieFormValues } from "@/components/admin/MovieForm/MovieForm";
import { adminApi, AdminLanguage } from "@/apis/admin.api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { MovieStatus } from "@/constants/enum";

export default function UpdatePanel() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const isCreate = id === "new";

  const [loading, setLoading] = React.useState(!isCreate);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [initial, setInitial] = React.useState<MovieFormValues | null>(null);

  React.useEffect(() => {
    if (isCreate) {
      setInitial({
        id: "",
        title: "",
        overview: "",
        cast: [],
        crew: [],
        original_language: {
          id: '',
          name: '',
          english_name: '',
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
        release_date: ""
      });
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.getMovie(id);
        if (!mounted) return;
        if (res.success && res.data) {
          const m = res.data;
          setInitial({
            id: m.id,
            title: m.title,
            overview: m.overview,
            status: m.status,
            genres: m.genres?.map((g) => ({ id: g.id, names: g.names })) || [],
            keywords: m.keywords?.map((k) => ({ id: k.id, name: k.name })) || [],
            spoken_languages: m.spoken_languages as AdminLanguage[],
            production_companies: m.production_companies?.map((p) => ({ id: p.id, name: p.name })) || [],
            backdrops: m.backdrops || [],
            posters: m.posters || [],
            cast: m.cast,
            crew: m.crew,
            original_language: m.original_language,
            price: m.price,
            release_date: ""
          });
        } else {
          setError(res.message || "Failed to load movie");
        }
      } catch {
        setError("Failed to load movie");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isCreate]);

  const handleClose = () => router.back();

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

      if (isCreate) {
        await adminApi.createMovie(savingValues);
      } else {
        await adminApi.updateMovie(id, savingValues);
      }


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
            {isCreate ? "Create Movie" : "Update Movie"}
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
