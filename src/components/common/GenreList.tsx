'use client';
import { Genre, useGenreStore, useLanguageStore } from '@/zustand';
import Link from 'next/link';
import React from 'react';

interface DisplayGenre extends Genre {
  bgColor: {
    r: number;
    g: number;
    b: number;
  }
}

export default function GenreList() {

  const genres = useGenreStore((state) => state.genres);
  const { currentLanguage } = useLanguageStore();
  const [displayGenres, setDisplayGenres] = React.useState<DisplayGenre[]>([]);

  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    const nameForLanguage = genre.names.find(n => n.iso_639_1 === currentLanguage.iso_639_1);
    return nameForLanguage ? nameForLanguage.name : genre.names[0]?.name || 'Unknown';
  };

  const defaultGenre =
  {
    id: 'all',
    names: [
      {
        iso_639_1: 'en',
        name: 'All Genres',
      },
      {
        iso_639_1: 'vi',
        name: 'Tất cả thể loại',
      }
    ],
    bgColor: {
      r: 0,
      g: 0,
      b: 0,
    },
    original_id: '',
    created_at: '',
    updated_at: '',
  }

  React.useEffect(() => {
    if (genres.length > 0) {

      const newDisplayGenres = genres.map((genre) => {
        const r = Math.floor(Math.random() * 100) + 155;
        const g = Math.floor(Math.random() * 100) + 155;
        const b = Math.floor(Math.random() * 100) + 155;
        return {
          ...genre,
          bgColor: {
            r,
            g,
            b,
          }
        };
      }).slice(0, 6).concat(
        defaultGenre
      );

      setDisplayGenres(newDisplayGenres);
    } else {
      setDisplayGenres([defaultGenre]);
    }
  }, [genres, currentLanguage]);

  return (
    <div className="w-full bg-gradient-to-b from-transparent to-black">
      <div className="flex gap-12 flex-wrap py-4 px-8">
        {displayGenres.length > 0 && displayGenres.map((genre) => {
          const bgColor = `rgb(${genre.bgColor.r}, ${genre.bgColor.g}, ${genre.bgColor.b})`;
          const textColor = genre.bgColor.r + genre.bgColor.g + genre.bgColor.b > 192 ? 'black' : 'white';
          return (
            <Link
              key={genre.id}
              href={`/genre/${genre.original_id}`}
              className={`flex justify-center items-center min-w-[200px] h-[120px] rounded-lg py-6 px-12 hover: opacity-90 transition-opacity`}
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, ${bgColor} 30%)`,
                flex: 1,
              }}
            >
              <h3 className={`text-xl font-semibold`} style={{ color: textColor }}>{getGenreName(genre)}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  );
}