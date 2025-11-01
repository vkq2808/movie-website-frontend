'use client';
import { useGenreStore, useLanguageStore } from '@/zustand';
import Link from 'next/link';
import React from 'react';
import Spinner from './Spinner';
import { Genre } from '@/types/api.types';

interface DisplayGenre extends Genre {
  bgColor: {
    r: number;
    g: number;
    b: number;
  }
}

export default function GenreList() {

  const genres = useGenreStore((state) => state.genres);
  const fetchGenres = useGenreStore((state) => state.fetchGenres);
  const language = useLanguageStore(l => l.currentLanguage)
  const [displayGenres, setDisplayGenres] = React.useState<DisplayGenre[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Function to get genre name based on current language
  const getGenreName = (genre: Genre) => {
    if (!genre.names || genre.names.length === 0) {
      return 'Tất cả thể loại'
    }
    const nameForLanguage = genre.names.find(n => n.iso_639_1 === language.iso_639_1);
    return nameForLanguage ? nameForLanguage.name : genre.names[0]?.name || 'Unknown';
  };

  const defaultGenre = React.useMemo(() => ({
    id: 'all',
    names: [],
    bgColor: {
      r: 0,
      g: 0,
      b: 0,
    },
    original_id: '',
    created_at: '',
    updated_at: '',
  } as DisplayGenre), []);

  const createDisplayGenres = (genres: Genre[], defaultGenre: DisplayGenre) => {
    return genres.slice(0, 6).map((genre) => {
      const r = Math.floor(Math.random() * 100) + 155;
      const g = Math.floor(Math.random() * 100) + 155;
      const b = Math.floor(Math.random() * 100) + 155;
      return { ...genre, bgColor: { r, g, b } };
    }).concat(defaultGenre);
  };

  React.useEffect(() => {
    const initializeGenres = async () => {
      try {
        setLoading(true);

        if (genres.length === 0) {
          await fetchGenres();
          return;
        }

        setDisplayGenres(createDisplayGenres(genres, defaultGenre));
      } catch (error) {
        console.error("Error loading genres:", error);
        setDisplayGenres([defaultGenre]);
      } finally {
        setLoading(false);
      }
    };

    initializeGenres();
  }, [defaultGenre, fetchGenres]);

  React.useEffect(() => {
    if (genres.length > 0) {
      setDisplayGenres(createDisplayGenres(genres, defaultGenre));
    }
  }, [genres, defaultGenre]);


  if (loading) {
    return (
      <div className="w-full">
        <div className="flex gap-12 flex-wrap py-4 px-8 min-h-[180px]">
          <div className="w-full flex justify-center items-center">
            <div className="flex flex-col items-center">
              <Spinner size="lg" color="text-white" />
              <p className="mt-4 text-white animate-pulse">Đang tải thể loại...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-12 flex-wrap py-4 px-8 min-h-[180px]">
        {displayGenres.length > 0 && displayGenres.map((genre) => {
          const bgColor = `rgb(${genre.bgColor.r}, ${genre.bgColor.g}, ${genre.bgColor.b})`;
          const textColor = genre.bgColor.r + genre.bgColor.g + genre.bgColor.b > 192 ? 'black' : 'white';
          return (
            <Link
              key={genre.id}
              href={`/search?genres=${genre.id}`}
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