'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface Movie {
  id: string;
  title: string;
  description: string;
  release_date: string;
  poster_url?: string;
  trailer_url?: string;
  status: 'published' | 'draft';
  genres: Genre[];
  vote_average: number;
  popularity: number;
}

interface Genre {
  id: string;
  name: string;
}

interface MovieFormProps {
  movie?: Movie | null;
  onSubmit: (movieData: Partial<Movie>) => void;
  onCancel: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_date: '',
    poster_url: '',
    trailer_url: '',
    status: 'draft' as 'published' | 'draft',
    selectedGenres: [] as string[],
    vote_average: 0,
    popularity: 0,
  });

  const [availableGenres] = useState<Genre[]>([
    { id: '1', name: 'Action' },
    { id: '2', name: 'Adventure' },
    { id: '3', name: 'Comedy' },
    { id: '4', name: 'Crime' },
    { id: '5', name: 'Drama' },
    { id: '6', name: 'Horror' },
    { id: '7', name: 'Romance' },
    { id: '8', name: 'Sci-Fi' },
    { id: '9', name: 'Thriller' },
    { id: '10', name: 'Fantasy' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        release_date: movie.release_date || '',
        poster_url: movie.poster_url || '',
        trailer_url: movie.trailer_url || '',
        status: movie.status || 'draft',
        selectedGenres: movie.genres?.map(g => g.id) || [],
        vote_average: movie.vote_average || 0,
        popularity: movie.popularity || 0,
      });
    }
  }, [movie]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    }

    if (formData.selectedGenres.length === 0) {
      newErrors.genres = 'At least one genre must be selected';
    }

    if (formData.vote_average < 0 || formData.vote_average > 10) {
      newErrors.vote_average = 'Rating must be between 0 and 10';
    }

    if (formData.popularity < 0) {
      newErrors.popularity = 'Popularity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const movieData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        release_date: formData.release_date,
        poster_url: formData.poster_url.trim() || undefined,
        trailer_url: formData.trailer_url.trim() || undefined,
        status: formData.status,
        genres: availableGenres.filter(g => formData.selectedGenres.includes(g.id)),
        vote_average: formData.vote_average,
        popularity: formData.popularity,
      };

      await onSubmit(movieData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenreChange = (genreId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedGenres: checked
        ? [...prev.selectedGenres, genreId]
        : prev.selectedGenres.filter(id => id !== genreId)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to your server/CDN
      // For demo purposes, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, poster_url: url }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-800 shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-6 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.title
                    ? 'border-red-600 bg-red-50 text-red-900'
                    : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                  placeholder="Enter movie title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.description
                    ? 'border-red-600 bg-red-50 text-red-900'
                    : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                  placeholder="Enter movie description"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Release Date */}
              <div>
                <label htmlFor="release_date" className="block text-sm font-medium text-gray-300">
                  Release Date *
                </label>
                <input
                  type="date"
                  id="release_date"
                  value={formData.release_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.release_date
                    ? 'border-red-600 bg-red-50 text-red-900'
                    : 'border-gray-600 bg-gray-700 text-white'
                    }`}
                />
                {errors.release_date && (
                  <p className="mt-2 text-sm text-red-600">{errors.release_date}</p>
                )}
              </div>

              {/* Poster Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Poster Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {formData.poster_url ? (
                      <div className="relative">
                        <Image
                          src={formData.poster_url}
                          alt="Poster preview"
                          width={96}
                          height={128}
                          className="mx-auto h-32 w-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, poster_url: '' }))}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="poster-upload"
                            className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="poster-upload"
                              name="poster-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or enter image URL"
                    value={formData.poster_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, poster_url: e.target.value }))}
                    className="block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
                  />
                </div>
              </div>

              {/* Trailer URL */}
              <div>
                <label htmlFor="trailer_url" className="block text-sm font-medium text-gray-300">
                  Trailer URL
                </label>
                <input
                  type="url"
                  id="trailer_url"
                  value={formData.trailer_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, trailer_url: e.target.value }))}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Genres *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {availableGenres.map((genre) => (
                    <label key={genre.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedGenres.includes(genre.id)}
                        onChange={(e) => handleGenreChange(genre.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-300">{genre.name}</span>
                    </label>
                  ))}
                </div>
                {errors.genres && (
                  <p className="mt-2 text-sm text-red-600">{errors.genres}</p>
                )}
              </div>

              {/* Rating and Popularity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vote_average" className="block text-sm font-medium text-gray-300">
                    Rating (0-10)
                  </label>
                  <input
                    type="number"
                    id="vote_average"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.vote_average}
                    onChange={(e) => setFormData(prev => ({ ...prev, vote_average: parseFloat(e.target.value) || 0 }))}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.vote_average
                      ? 'border-red-600 bg-red-50 text-red-900'
                      : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                  />
                  {errors.vote_average && (
                    <p className="mt-2 text-sm text-red-600">{errors.vote_average}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="popularity" className="block text-sm font-medium text-gray-300">
                    Popularity
                  </label>
                  <input
                    type="number"
                    id="popularity"
                    min="0"
                    step="0.1"
                    value={formData.popularity}
                    onChange={(e) => setFormData(prev => ({ ...prev, popularity: parseFloat(e.target.value) || 0 }))}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.popularity
                      ? 'border-red-600 bg-red-50 text-red-900'
                      : 'border-gray-600 bg-gray-700 text-white'
                      }`}
                  />
                  {errors.popularity && (
                    <p className="mt-2 text-sm text-red-600">{errors.popularity}</p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Publication Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">Draft - Not visible to users</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'published' | 'draft' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-300">Published - Visible to users</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-4 py-3 bg-gray-700 text-right sm:px-6 space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (movie ? 'Update Movie' : 'Create Movie')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
