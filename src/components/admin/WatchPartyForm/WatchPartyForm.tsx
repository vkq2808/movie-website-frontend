"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, WatchPartyMovie, type AdminMovie, type CreateWatchPartyEventData } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface WatchPartyFormProps {
  onSubmit: (data: CreateWatchPartyEventData) => Promise<void>;
  submitting?: boolean;
  initialData?: Partial<CreateWatchPartyEventData & { movie: WatchPartyMovie }>;
}

export default function WatchPartyForm({ onSubmit, submitting = false, initialData }: WatchPartyFormProps) {
  const toast = useToast();
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<WatchPartyMovie | null>(null);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [isFeatured, setIsFeatured] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [ticketDescription, setTicketDescription] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      if (initialData.movie) {
        setSelectedMovie(initialData.movie);
        setSearchQuery(initialData.movie.title);
      }
      setStartTime(initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '');
      setEndTime(initialData.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '');
      setRecurrence(initialData.recurrence || '');
      setMaxParticipants(initialData.max_participants || 100);
      setIsFeatured(initialData.is_featured || false);
      setTicketPrice(initialData.ticket_price || 0);
      setTicketDescription(initialData.ticket_description || '');
    }
  }, [initialData]);

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

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!selectedMovie) newErrors.movie = 'Please select a movie';
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!endTime) newErrors.endTime = 'End time is required';
    if (new Date(startTime) >= new Date(endTime)) newErrors.time = 'End time must be after start time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: CreateWatchPartyEventData = {
      movie_id: selectedMovie!.id,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      recurrence,
      max_participants: maxParticipants,
      is_featured: isFeatured,
      ticket_price: ticketPrice,
      ticket_description: ticketDescription,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="movie_search">Movie</Label>
        <Input
          id="movie_search"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <div>
            {loadingMovies ? <p>Loading...</p> : filteredMovies.map(movie => (
              <button key={movie.id} type="button" onClick={() => {
                setSelectedMovie(movie);
                setSearchQuery(movie.title);
              }}>
                {movie.title}
              </button>
            ))}
          </div>
        )}
        {selectedMovie && <p>Selected: {selectedMovie.title}</p>}
        {errors.movie && <p className="text-red-500">{errors.movie}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input id="start_time" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
          {errors.startTime && <p className="text-red-500">{errors.startTime}</p>}
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
          {errors.endTime && <p className="text-red-500">{errors.endTime}</p>}
        </div>
      </div>
      {errors.time && <p className="text-red-500">{errors.time}</p>}

      <div>
        <Label htmlFor="recurrence">Recurrence (optional, e.g., &apos;every day&apos;, &apos;every monday&apos;)</Label>
        <Input id="recurrence" value={recurrence} onChange={e => setRecurrence(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input id="max_participants" type="number" value={maxParticipants} onChange={e => setMaxParticipants(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="ticket_price">Ticket Price</Label>
          <Input id="ticket_price" type="number" value={ticketPrice} onChange={e => setTicketPrice(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <Label htmlFor="ticket_description">Ticket Description</Label>
        <Textarea id="ticket_description" value={ticketDescription} onChange={e => setTicketDescription(e.target.value)} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
        <Label htmlFor="is_featured">Featured Event</Label>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : (initialData ? 'Update Event' : 'Create Event')}
      </Button>
    </form>
  );
}

