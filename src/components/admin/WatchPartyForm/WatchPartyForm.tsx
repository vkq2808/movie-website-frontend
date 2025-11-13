"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi, type AdminMovie, type CreateWatchPartyEventData } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';

interface WatchPartyFormProps {
  onSubmit: (data: CreateWatchPartyEventData) => Promise<void>;
  submitting?: boolean;
}

type EventType = 'random' | 'scheduled' | 'recurring';
type RecurrenceType = 'daily' | 'weekly' | 'monthly';
type EndOption = 'date' | 'count';

export default function WatchPartyForm({ onSubmit, submitting = false }: WatchPartyFormProps) {
  const toast = useToast();
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<AdminMovie | null>(null);
  const [eventType, setEventType] = useState<EventType>('random');
  const [scheduledStartTime, setScheduledStartTime] = useState(''); // Store as datetime-local format string
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [endOption, setEndOption] = useState<EndOption>('date');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [recurrenceCount, setRecurrenceCount] = useState(7);
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoadingMovies(true);
        const res = await adminApi.getMovies({ page: 1, limit: 100, status: 'all' });
        if (res.success && res.data) {
          setMovies(res.data.movies);
        }
      } catch (error) {
        toast.error('Failed to load movies');
      } finally {
        setLoadingMovies(false);
      }
    };
    loadMovies();
  }, [toast]);

  // Filter movies based on search
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies.slice(0, 10);
    const query = searchQuery.toLowerCase();
    return movies
      .filter((m) => m.title.toLowerCase().includes(query))
      .slice(0, 10);
  }, [movies, searchQuery]);

  // Calculate preview for recurring events
  const previewCount = useMemo(() => {
    if (eventType !== 'recurring' || !scheduledStartTime) return 0;
    
    try {
      const start = new Date(scheduledStartTime);
      if (isNaN(start.getTime())) return 0;

      if (endOption === 'count') {
        return Math.min(recurrenceCount, 365);
      } else if (endOption === 'date' && recurrenceEndDate) {
        const end = new Date(recurrenceEndDate);
        if (isNaN(end.getTime()) || end < start) return 0;

        let count = 0;
        let current = new Date(start);
        const increment = recurrenceType === 'daily' ? 1 : recurrenceType === 'weekly' ? 7 : 30;

        while (current <= end && count < 365) {
          count++;
          current = new Date(current);
          if (recurrenceType === 'daily') {
            current.setDate(current.getDate() + 1);
          } else if (recurrenceType === 'weekly') {
            current.setDate(current.getDate() + 7);
          } else {
            current.setMonth(current.getMonth() + 1);
          }
        }
        return count;
      }
    } catch {
      return 0;
    }
    return 0;
  }, [eventType, scheduledStartTime, recurrenceType, endOption, recurrenceEndDate, recurrenceCount]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedMovie) {
      newErrors.movie = 'Please select a movie';
    }

    if (eventType === 'scheduled' || eventType === 'recurring') {
      if (!scheduledStartTime) {
        newErrors.scheduledStartTime = 'Scheduled start time is required';
      } else {
        const start = new Date(scheduledStartTime);
        const now = new Date();
        if (isNaN(start.getTime())) {
          newErrors.scheduledStartTime = 'Invalid date/time';
        } else if (start <= now) {
          newErrors.scheduledStartTime = 'Start time must be in the future';
        }
      }
    }

    if (eventType === 'recurring') {
      if (endOption === 'date') {
        if (!recurrenceEndDate) {
          newErrors.recurrenceEndDate = 'End date is required';
        } else if (scheduledStartTime) {
          const start = new Date(scheduledStartTime);
          const end = new Date(recurrenceEndDate);
          if (end <= start) {
            newErrors.recurrenceEndDate = 'End date must be after start time';
          }
        }
      } else {
        if (!recurrenceCount || recurrenceCount < 1) {
          newErrors.recurrenceCount = 'Count must be at least 1';
        } else if (recurrenceCount > 365) {
          newErrors.recurrenceCount = 'Count cannot exceed 365';
        }
      }
    }

    if (maxParticipants < 1) {
      newErrors.maxParticipants = 'Max participants must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const data: CreateWatchPartyEventData = {
      movie_id: selectedMovie!.id,
      event_type: eventType,
      max_participants: maxParticipants,
      is_featured: isFeatured,
    };

    if (eventType === 'scheduled' || eventType === 'recurring') {
      // Convert datetime-local to ISO string
      if (scheduledStartTime) {
        const date = new Date(scheduledStartTime);
        data.scheduled_start_time = date.toISOString();
      }
    }

    if (eventType === 'recurring') {
      data.recurrence_type = recurrenceType;
      if (endOption === 'date') {
        // recurrenceEndDate is already in ISO format from the date input handler
        data.recurrence_end_date = recurrenceEndDate;
      } else {
        data.recurrence_count = recurrenceCount;
      }
    }

    await onSubmit(data);
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Movie Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Movie <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          {searchQuery && (
            <div className="absolute z-10 mt-1 w-full rounded-lg bg-gray-800 border border-gray-700 max-h-60 overflow-y-auto">
              {loadingMovies ? (
                <div className="px-4 py-2 text-gray-400">Loading...</div>
              ) : filteredMovies.length === 0 ? (
                <div className="px-4 py-2 text-gray-400">No movies found</div>
              ) : (
                filteredMovies.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setSearchQuery(movie.title);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                  >
                    {movie.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
          >
            <span className="text-white font-medium">{selectedMovie.title}</span>
            {selectedMovie.runtime && (
              <span className="ml-2 text-gray-400 text-sm">({selectedMovie.runtime} min)</span>
            )}
          </motion.div>
        )}
        {errors.movie && <p className="mt-1 text-sm text-red-500">{errors.movie}</p>}
      </div>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Event Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['random', 'scheduled', 'recurring'] as EventType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEventType(type)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                eventType === type
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {type === 'random' && 'Random (Start Now)'}
              {type === 'scheduled' && 'Scheduled'}
              {type === 'recurring' && 'Recurring Scheduled'}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Start Time */}
      <AnimatePresence>
        {(eventType === 'scheduled' || eventType === 'recurring') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scheduled Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledStartTime}
              onChange={(e) => setScheduledStartTime(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            {errors.scheduledStartTime && (
              <p className="mt-1 text-sm text-red-500">{errors.scheduledStartTime}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recurrence Options */}
      <AnimatePresence>
        {eventType === 'recurring' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Recurrence Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['daily', 'weekly', 'monthly'] as RecurrenceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRecurrenceType(type)}
                    className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                      recurrenceType === type
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                End Option <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setEndOption('date')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    endOption === 'date'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  End Date
                </button>
                <button
                  type="button"
                  onClick={() => setEndOption('count')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    endOption === 'count'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Number of Occurrences
                </button>
              </div>

              {endOption === 'date' ? (
                <div>
                  <input
                    type="date"
                    value={recurrenceEndDate ? new Date(recurrenceEndDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const date = new Date(e.target.value);
                        date.setHours(23, 59, 59, 999); // Set to end of day
                        setRecurrenceEndDate(date.toISOString());
                      } else {
                        setRecurrenceEndDate('');
                      }
                    }}
                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.recurrenceEndDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.recurrenceEndDate}</p>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={recurrenceCount}
                    onChange={(e) => setRecurrenceCount(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.recurrenceCount && (
                    <p className="mt-1 text-sm text-red-500">{errors.recurrenceCount}</p>
                  )}
                </div>
              )}

              {previewCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 px-3 py-2 bg-blue-900/30 border border-blue-700 rounded-lg"
                >
                  <p className="text-sm text-blue-300">
                    Will create approximately <strong>{previewCount}</strong> event{previewCount !== 1 ? 's' : ''}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Max Participants */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Max Participants
        </label>
        <input
          type="number"
          min={1}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        {errors.maxParticipants && (
          <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-2 focus:ring-red-600"
        />
        <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-300">
          Featured Event
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
      >
        {submitting ? 'Creating...' : 'Create Watch Party Event(s)'}
      </button>
    </form>
  );
}

