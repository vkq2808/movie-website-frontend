import React, { useState, useEffect } from 'react';
import { getMovieAlternativeTitles } from '@/apis/movie.api';

interface AlternativeTitleProps {
  movieId: string;
}

interface AlternativeTitle {
  id: string;
  title: string;
  countryCode: string;
  type?: string;
  created_at: string;
  updated_at: string;
}

const AlternativeTitlesList: React.FC<AlternativeTitleProps> = ({ movieId }) => {
  const [titles, setTitles] = useState<AlternativeTitle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlternativeTitles = async () => {
      try {
        setLoading(true);
        const data = await getMovieAlternativeTitles(movieId);
        setTitles(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load alternative titles');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchAlternativeTitles();
    }
  }, [movieId]);

  if (loading) {
    return <div className="flex justify-center p-4">Loading alternative titles...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (titles.length === 0) {
    return <div className="text-gray-500 italic p-4">No alternative titles available</div>;
  }

  return (
    <div className="my-4">
      <h3 className="text-xl font-semibold mb-2">Alternative Titles</h3>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {titles.map((title) => (
              <tr key={title.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{title.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{title.countryCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{title.type || 'Alternative'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlternativeTitlesList;
