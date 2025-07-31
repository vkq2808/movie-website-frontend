'use client';
import React, { useState, useEffect } from 'react';
import { getUserPurchases, MoviePurchaseResponse } from '@/apis/movie-purchase.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';

const UserPurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<MoviePurchaseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        const response = await getUserPurchases();
        setPurchases(response.data);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error &&
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          setError(error.response.data.message as string);
        } else {
          setError('Failed to load purchases');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner />
          <p className="mt-4 text-white animate-pulse">Loading your purchases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Purchased Movies</h1>
          <p className="text-gray-400">
            You have purchased {purchases.length} movie{purchases.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Empty State */}
        {purchases.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1l-1 10a2 2 0 01-2 2H6a2 2 0 01-2-2L3 7H2a1 1 0 01-1-1V5a1 1 0 011-1h4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No purchases yet</h3>
            <p className="text-gray-500 mb-6">Start exploring movies and build your collection</p>
            <Link
              href="/home"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          /* Purchases Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors duration-200"
              >
                {/* Movie Poster Placeholder */}
                <div className="aspect-[2/3] bg-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <svg
                      className="w-16 h-16"
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

                  {/* Owned Badge */}
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Owned
                  </div>
                </div>

                {/* Movie Details */}
                <div className="p-4 space-y-3">
                  <h3 className="font-medium text-white line-clamp-2">
                    {purchase.movie_title}
                  </h3>

                  <div className="text-sm text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Purchase Price:</span>
                      <span className="text-green-400 font-medium">
                        ${purchase.purchase_price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchased:</span>
                      <span>
                        {new Date(purchase.purchased_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/movie/${purchase.movie_id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
                    >
                      Watch Now
                    </Link>
                    <Link
                      href={`/movie/${purchase.movie_id}`}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {purchases.length > 0 && (
          <div className="mt-12 p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Purchase Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-400">{purchases.length}</p>
                <p className="text-gray-400">Movies Owned</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">
                  ${purchases.reduce((total, purchase) => total + purchase.purchase_price, 0).toFixed(2)}
                </p>
                <p className="text-gray-400">Total Spent</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-400">
                  ${(purchases.reduce((total, purchase) => total + purchase.purchase_price, 0) / purchases.length).toFixed(2)}
                </p>
                <p className="text-gray-400">Average Price</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPurchasesPage;
