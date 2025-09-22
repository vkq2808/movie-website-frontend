'use client';
import React from 'react';
import Image from 'next/image';
import { Movie } from '@/zustand/types';
import { HeartIcon, PlayIcon } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02]">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] w-full">
          {movie.poster ? (
            <Image
              src={movie.poster.url || '/placeholder-poster.jpg'}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-slate-500">No Poster</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                {movie.vote_average.toFixed(1)}
              </span>
              <button className="text-white hover:text-red-500 transition-colors">
                <HeartIcon size={20} />
              </button>
            </div>

            <h3 className="text-white font-semibold truncate">{movie.title}</h3>
            <p className="text-gray-300 text-sm">
              {new Date(movie.release_date).getFullYear()} • {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </p>

            <button className="mt-3 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-md py-1 transition-colors">
              <PlayIcon size={16} />
              <span>Watch</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
