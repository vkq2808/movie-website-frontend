"use client";
import { useState } from 'react';

export type MovieFormValues = {
  title: string;
  description: string;
  release_date: string;
  status: 'published' | 'draft';
};

export default function MovieForm({
  initialValues,
  onSubmit,
  submitting = false,
}: {
  initialValues?: Partial<MovieFormValues>;
  onSubmit: (values: MovieFormValues) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<MovieFormValues>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    release_date: initialValues?.release_date ?? '',
    status: initialValues?.status ?? 'draft',
  });

  const update = (k: keyof MovieFormValues, v: string | MovieFormValues['status']) =>
    setValues((s) => ({ ...s, [k]: v } as MovieFormValues));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(values);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-gray-300">Title</label>
        <input
          className="mt-1 w-full rounded border border-gray-700 bg-gray-800 p-2 text-sm outline-none focus:border-blue-500"
          value={values.title}
          onChange={(e) => update('title', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300">Description</label>
        <textarea
          className="mt-1 w-full rounded border border-gray-700 bg-gray-800 p-2 text-sm outline-none focus:border-blue-500"
          rows={4}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-300">Release date</label>
          <input
            type="date"
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 p-2 text-sm outline-none focus:border-blue-500"
            value={values.release_date}
            onChange={(e) => update('release_date', e.currentTarget.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Status</label>
          <select
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 p-2 text-sm outline-none focus:border-blue-500"
            value={values.status}
            onChange={(e) => update('status', e.currentTarget.value as MovieFormValues['status'])}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

