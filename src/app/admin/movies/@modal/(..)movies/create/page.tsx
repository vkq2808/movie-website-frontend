"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import MovieForm, { type MovieFormValues } from "@/components/admin/MovieForm/MovieForm";
import { adminApi, AdminLanguage } from "@/apis/admin.api";
import { MovieStatus } from "@/constants/enum";
import { useToast } from "@/contexts/toast.context";

export default function CreateModal() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const toast = useToast();
  const initial: MovieFormValues = {
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
  };

  const handleClose = () => router.back();

  const handleSubmit = async (values: MovieFormValues) => {
    try {
      setSubmitting(true);

      const savingValues = {
        ...values
      }

      await adminApi.createMovie(savingValues);

      router.back();
    } catch {
      toast.error("Failed to save movie");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-[720px] max-h-[90vh] rounded-lg border border-gray-700 bg-gray-900 shadow-xl flex flex-col">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Create Movie
          </h2>
          <button
            onClick={handleClose}
            className="rounded bg-gray-700 px-3 py-1 text-xs text-gray-100 hover:bg-gray-600"
          >
            Close
          </button>
        </div>
        {/* Nội dung scroll */}
        <div className="overflow-y-auto p-6 flex-1">
          <MovieForm
            initialValues={initial!}
            onSubmit={handleSubmit}
            submitting={submitting}
            isCreate={true}
          />
        </div>
      </div>
    </div>
  );
}
