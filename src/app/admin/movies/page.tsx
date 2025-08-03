'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// Import MovieForm component
import MovieForm from '../../../components/admin/MovieForm';

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
  created_at: string;
  updated_at: string;
}

interface Genre {
  id: string;
  name: string;
}

const MovieManagement: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockMovies: Movie[] = [
            {
              id: '1',
              title: 'Avengers: Endgame',
              description: 'The epic conclusion to the Infinity Saga',
              release_date: '2019-04-26',
              poster_url: '/posters/avengers-endgame.jpg',
              trailer_url: 'https://youtube.com/watch?v=example',
              status: 'published',
              genres: [{ id: '1', name: 'Action' }, { id: '2', name: 'Adventure' }],
              vote_average: 8.4,
              popularity: 85.2,
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
            },
            {
              id: '2',
              title: 'The Batman',
              description: 'A dark and gritty take on the Batman character',
              release_date: '2022-03-04',
              status: 'published',
              genres: [{ id: '3', name: 'Crime' }, { id: '4', name: 'Drama' }],
              vote_average: 7.8,
              popularity: 72.1,
              created_at: '2023-01-02T00:00:00Z',
              updated_at: '2023-01-02T00:00:00Z',
            },
            {
              id: '3',
              title: 'Spider-Man: No Way Home',
              description: 'The multiverse collides in this Spider-Man adventure',
              release_date: '2021-12-17',
              status: 'draft',
              genres: [{ id: '1', name: 'Action' }, { id: '5', name: 'Sci-Fi' }],
              vote_average: 8.2,
              popularity: 78.9,
              created_at: '2023-01-03T00:00:00Z',
              updated_at: '2023-01-03T00:00:00Z',
            },
          ];

          setMovies(mockMovies);
          setTotalPages(Math.ceil(mockMovies.length / itemsPerPage));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleDelete = async (movieId: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        // Simulate API call
        setMovies(movies.filter(movie => movie.id !== movieId));
        console.log('Deleting movie:', movieId);
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleFormSubmit = async (movieData: Partial<Movie>) => {
    try {
      if (editingMovie) {
        // Update existing movie
        const updatedMovie = { ...editingMovie, ...movieData, updated_at: new Date().toISOString() };
        setMovies(movies.map(movie => movie.id === editingMovie.id ? updatedMovie : movie));
      } else {
        // Create new movie
        const newMovie: Movie = {
          id: Date.now().toString(),
          ...movieData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Movie;
        setMovies([newMovie, ...movies]);
      }
      setShowForm(false);
      setEditingMovie(null);
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  if (loading) {
    return (
      <AdminLayout title="Movie Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout title={editingMovie ? 'Edit Movie' : 'Add New Movie'}>
        <MovieForm
          movie={editingMovie}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Movie Management">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Add Movie Button */}
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Movie
        </button>
      </div>

      {/* Movies Table */}
      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Movie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Genres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Release Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {paginatedMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {movie.poster_url && (
                        <div className="flex-shrink-0 h-16 w-12">
                          <Image
                            className="h-16 w-12 object-cover rounded"
                            src={movie.poster_url}
                            alt={movie.title}
                            width={48}
                            height={64}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-poster.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className={movie.poster_url ? 'ml-4' : ''}>
                        <div className="text-sm font-medium text-white">{movie.title}</div>
                        <div className="text-sm text-gray-400 max-w-xs truncate">
                          {movie.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${movie.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {movie.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ⭐ {movie.vote_average}/10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredMovies.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredMovies.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        } ${pageNum === 1 ? 'rounded-l-md' : ''
                        } ${pageNum === totalPages ? 'rounded-r-md' : ''
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 8a2 2 0 012 2v32a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2h24zM20 22l4-4 4 4m-4-4v12"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No movies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding a new movie.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add your first movie
              </button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default MovieManagement;
