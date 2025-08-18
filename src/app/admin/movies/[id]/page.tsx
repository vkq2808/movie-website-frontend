"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MovieForm, { MovieFormValues } from '@/components/admin/MovieForm';
import { adminApi } from '@/apis/admin.api';

export default function AdminMovieDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [initial, setInitial] = React.useState<MovieFormValues | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.getMovie(id);
        if (!mounted) return;
        if (res.success && res.data) {
          setInitial({
            title: res.data.title,
            description: res.data.description,
            release_date: res.data.release_date?.slice(0, 10) ?? '',
            status: res.data.status,
          });
        } else {
          setError(res.message || 'Failed to load movie');
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load movie';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (values: MovieFormValues) => {
    try {
      setSubmitting(true);
      await adminApi.updateMovie(id, { id, ...values, genre_ids: [] });
      router.push('/admin/movies');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Edit Movie</h1>
      {loading ? (
        <div className="flex h-40 items-center justify-center"><LoadingSpinner /></div>
      ) : error ? (
        <div className="rounded bg-red-500/10 p-3 text-sm text-red-300">{error}</div>
      ) : initial ? (
        <MovieForm initialValues={initial} onSubmit={handleSubmit} submitting={submitting} />
      ) : null}
    </>
  );
}
