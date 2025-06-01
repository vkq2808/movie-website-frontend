import React, { useState } from 'react';
import {
  updateMovieAlternativeTitles,
  importMovieAlternativeTitles
} from '@/apis/movie.api';

interface AlternativeTitleAdminProps {
  movieId: string;
  onUpdate?: () => void;
}

const AlternativeTitleAdmin: React.FC<AlternativeTitleAdminProps> = ({
  movieId,
  onUpdate
}) => {
  const [tmdbId, setTmdbId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setMessage(null);
      const result = await updateMovieAlternativeTitles(movieId);
      setMessage({
        text: `Successfully updated with ${result.count || 0} alternative titles`,
        type: 'success'
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage({
        text: 'Failed to update alternative titles',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!tmdbId || isNaN(Number(tmdbId))) {
      setMessage({ text: 'Please enter a valid TMDB ID', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const result = await importMovieAlternativeTitles(movieId, Number(tmdbId));
      setMessage({
        text: `Successfully imported ${result.titles?.length || 0} alternative titles`,
        type: 'success'
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      setMessage({
        text: 'Failed to import alternative titles',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <h3 className="text-xl font-semibold mb-3">Manage Alternative Titles</h3>

      {message && (
        <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Update Alternative Titles from TMDB'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tmdbId}
            onChange={(e) => setTmdbId(e.target.value)}
            placeholder="Enter TMDB ID"
            className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleImport}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Importing...' : 'Import from TMDB ID'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlternativeTitleAdmin;
