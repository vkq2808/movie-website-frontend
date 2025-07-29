'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/zustand/types';
import { checkMovieOwnership } from '@/apis/movie-purchase.api';
import { useAuthStore } from '@/zustand/auth.store';

interface MovieCardWithPurchaseProps {
  movie: Movie;
  showPurchaseStatus?: boolean;
  className?: string;
}

const MovieCardWithPurchase: React.FC<MovieCardWithPurchaseProps> = ({
  movie,
  showPurchaseStatus = true,
  className = '',
}) => {
  const [ownsMovie, setOwnsMovie] = useState(false);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(false);

  // Get user from auth store
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // Only check ownership if user is authenticated and showPurchaseStatus is true
    if (showPurchaseStatus && user) {
      const checkOwnership = async () => {
        try {
          setIsCheckingOwnership(true);
          const response = await checkMovieOwnership(movie.id);
          setOwnsMovie(response.data.owns_movie);
        } catch (error) {
          console.error('Error checking movie ownership:', error);
          // Fail silently for ownership check
        } finally {
          setIsCheckingOwnership(false);
        }
      };

      checkOwnership();
    } else {
      // Reset ownership state if user is not authenticated
      setOwnsMovie(false);
      setIsCheckingOwnership(false);
    }
  }, [movie.id, showPurchaseStatus, user]);

  return (
    <div className={`relative group ${className}`}>
      <Link href={`/movie/${movie.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition-transform duration-200">
          {/* Movie Poster */}
          <div className="aspect-[2/3] relative">
            {movie.poster ? (
              <Image
                src={movie.poster.url}
                alt={movie.poster.alt || movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16l13-8L7 4z"
                  />
                </svg>
              </div>
            )}

            {/* Ownership Badge */}
            {showPurchaseStatus && ownsMovie && (
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                Owned
              </div>
            )}

            {/* Price Badge */}
            {movie.price && movie.price > 0 && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                ${movie.price.toFixed(2)}
              </div>
            )}

            {/* Rating Badge */}
            {movie.vote_average && (
              <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l7-5-7-5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="p-3 bg-gray-800">
            <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
              {movie.title}
            </h3>
            {movie.release_date && (
              <p className="text-gray-400 text-xs">
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre.id}
                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {genre.names?.[0]?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCardWithPurchase;
