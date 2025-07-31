import React from 'react';
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - MovieStream",
  description: "The page you're looking for doesn't exist. Discover amazing movies on MovieStream instead.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text animate-pulse-custom">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Oops! The page you're looking for seems to have disappeared into the void.
            But don't worry, there are plenty of amazing movies waiting for you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/movies"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
          >
            Browse Movies
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">
            Looking for something specific?
          </p>
          <Link
            href="/search"
            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300"
          >
            Try our search feature
          </Link>
        </div>
      </div>
    </div>
  );
}