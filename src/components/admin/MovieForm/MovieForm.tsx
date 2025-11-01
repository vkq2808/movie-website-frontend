// components/admin/MovieForm.tsx
"use client";

import React, { useEffect } from "react";
import { MovieStatus } from "@/constants/enum";
import { AdminCast, AdminCrew, AdminGenre, AdminKeyword, AdminLanguage, AdminProductionCompany, AdminVideo, deleteImage } from "@/apis/admin.api";
import { useLanguageStore } from "@/zustand";
import { uploadImage } from '@/apis/admin.api';
import KeywordInput from "./KeywordInput";
import { GenreInput } from "./GenreInput";
import PersonInput from "./PersonInput";
import { Option } from "@/components/extensibles/AutoCompleteMultiSelectInput";
import { useToast } from "@/contexts/toast.context";
import BackdropsInput from "./BackdropInput";
import PostersInput from "./PosterInput";
import { OriginalLanguageInput } from "./OriginalLanguageInput";
import MovieVideoUploader from "./MovieVideoManager";

export interface MovieFormValues {
  id: string;
  title: string;
  overview: string;
  status: MovieStatus;
  original_language: AdminLanguage;
  videos: AdminVideo[];
  genres: AdminGenre[];
  production_companies: AdminProductionCompany[];
  keywords: AdminKeyword[];
  spoken_languages: AdminLanguage[];
  cast: AdminCast[];
  crew: AdminCrew[];
  backdrops: { url: string; alt: string }[];
  posters: { url: string; alt: string }[];
  price: number;
  release_date: string;
}

export default function MovieForm({
  initialValues,
  onSubmit,
  submitting,
  isCreate = false
}: {
  initialValues: MovieFormValues;
  onSubmit: (v: MovieFormValues) => void;
  submitting: boolean;
  isCreate?: boolean;
}) {
  const { currentLanguage } = useLanguageStore();
  const [values, setValues] = React.useState<MovieFormValues>(initialValues);
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setValues((prev) => ({
        ...prev,
        title: value,
        backdrops: prev.backdrops.map(b => ({ url: b.url, alt: value })),
        posters: prev.posters.map(p => ({ url: p.url, alt: value }))
      }))
      return;
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...values,
    });
  };

  const handleArrayFieldChange = <T extends Option,>(
    field: keyof MovieFormValues,
    newList: T[]
  ) => {
    setValues((prev) => ({ ...prev, [field]: newList }));
  };

  const handleSingleFieldChange = <T extends Option,>(
    field: keyof MovieFormValues,
    newItem: T
  ) => {
    setValues((prev) => ({ ...prev, [field]: newItem }))
  }

  const handleUploadMultipleFile = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target?.files;
    if (!files) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImage(file, values.id || ('new-' + field))
        if (!res.success) throw new Error("Upload failed");

        console.log(res.data.url);
        return res.data.url;
      } catch (error) {
        console.error("Error uploading files:", error);
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);

    const notNullUrls = urls.filter(u => u != null);
    const newUrls = [...values[field], ...notNullUrls.map(u => ({ url: u, alt: values.title }))]
    setValues((prev) => ({ ...prev, [field]: newUrls }))
    e.target.value = "";
  };

  const handleDeleteFile = async (url: string, field: string) => {
    await deleteImage(url)
    const newUrls = values[field].filter(v => v.url != url);
    setValues((prev) => ({ ...prev, [field]: newUrls }))
  }

  useEffect(() => { console.log(values) }, [values])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-200">
      {/* Title */}
      <div>
        <label className="block text-gray-400">Title<span className="text-red-500"> * </span></label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="w-full rounded bg-gray-800 p-2 text-white"
          required
        />
      </div>

      {/* Overview */}
      <div>
        <label className="block text-gray-400">Overview</label>
        <textarea
          name="overview"
          value={values.overview}
          onChange={handleChange}
          className="w-full rounded bg-gray-800 p-2 text-white"
          rows={3}
        />
      </div>

      {/* Status + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400">Status</label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full rounded bg-gray-800 p-2 text-white"
          >
            <option value={MovieStatus.DRAFT}>Draft</option>
            <option value={MovieStatus.PUBLISHED}>Published</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400">Price ($)</label>
          <input
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            className="w-full rounded bg-gray-800 p-2 text-white"
          />
        </div>
      </div>

      {/* Genres */}
      <GenreInput currentLanguage={currentLanguage} onChange={handleArrayFieldChange} values={values.genres} toast={toast} />

      {/* Keywords */}
      <KeywordInput onChange={handleArrayFieldChange} keywords={values.keywords} toast={toast} />

      {/* Original Language */}
      <OriginalLanguageInput onChange={handleSingleFieldChange} />

      {/* Cast */}
      {
        isCreate && <PersonInput label="Cast" field="cast" onChange={handleArrayFieldChange} values={values.cast} toast={toast} />
      }

      {/* Crew */}
      {
        isCreate && <PersonInput label="Crew" field="crew" onChange={handleArrayFieldChange} values={values.crew} toast={toast} />
      }

      {/* Production Companay */}


      {/* Backdrops */}
      <BackdropsInput backdrops={values.backdrops} addFunction={handleUploadMultipleFile} deleteFunction={handleDeleteFile} />

      {/* Posters */}
      <PostersInput posters={values.posters} addFunction={handleUploadMultipleFile} deleteFunction={handleDeleteFile} />

      <MovieVideoUploader movie={values} setValues={setValues} />


      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}