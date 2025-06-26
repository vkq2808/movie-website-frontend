import React, { useState, useEffect } from 'react';
import {
  addLanguageToMovie,
  removeLanguageFromMovie,
  getMovieById
} from '@/apis/movie.api';

interface Language {
  id: string;
  name: string;
  englishName: string;
  iso_639_1: string;
}

interface Movie {
  id: string;
  title: string;
  spoken_languages: Language[];
  original_language: Language;
}

interface MovieLanguagesProps {
  movieId: string;
  onLanguagesUpdated?: () => void;
}

const MovieLanguages: React.FC<MovieLanguagesProps> = ({ movieId, onLanguagesUpdated }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [languageCode, setLanguageCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchMovie = React.useCallback(async () => {
    try {
      setLoading(true);
      const movieData = await getMovieById(movieId);
      setMovie(movieData);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId, fetchMovie]);

  const handleAddLanguage = async () => {
    if (!languageCode || !movieId) return;

    try {
      setIsAdding(true);
      await addLanguageToMovie(movieId, languageCode);
      setLanguageCode('');
      await fetchMovie();
      if (onLanguagesUpdated) onLanguagesUpdated();
    } catch (error) {
      console.error('Error adding language:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveLanguage = async (languageCode: string) => {
    if (!movieId) return;

    try {
      await removeLanguageFromMovie(movieId, languageCode);
      await fetchMovie();
      if (onLanguagesUpdated) onLanguagesUpdated();
    } catch (error) {
      console.error('Error removing language:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>No movie found</div>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Movie Languages</h3>
      <p>Original Language: <span className="font-medium">{movie.original_language?.name || 'None'} ({movie.original_language?.iso_639_1 || 'unknown'})</span></p>

      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            placeholder="Language ISO code (e.g., en, fr, es)"
            className="px-3 py-2 border rounded w-64"
          />
          <button
            onClick={handleAddLanguage}
            disabled={isAdding || !languageCode}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
          >
            {isAdding ? 'Adding...' : 'Add Language'}
          </button>
        </div>

        <h4 className="text-md font-semibold mb-2">Spoken Languages:</h4>
        {movie.spoken_languages && movie.spoken_languages.length > 0 ? (
          <ul className="divide-y">
            {movie.spoken_languages.map((language) => (
              <li key={language.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({language.iso_639_1})</span>
                </div>
                <button
                  onClick={() => handleRemoveLanguage(language.iso_639_1)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No spoken languages specified</p>
        )}
      </div>
    </div>
  );
};

export default MovieLanguages;
