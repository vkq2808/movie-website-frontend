"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, WatchParty, WatchPartyMovie, type AdminMovie, type CreateWatchPartyEventData } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface WatchPartyFormProps {
  onSubmit: (data: CreateWatchPartyEventData) => Promise<void>;
  submitting?: boolean;
  initialData?: Partial<WatchParty>;
}

const defaultFormData: Partial<CreateWatchPartyEventData> = {
  start_time: '',
  recurrence: '',
  max_participants: 100,
  is_featured: false,
  ticket_price: 0,
  ticket_description: '',
};

export default function WatchPartyForm({ onSubmit, submitting = false, initialData }: WatchPartyFormProps) {
  const toast = useToast();
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<WatchPartyMovie | null>(null);
  const [formData, setFormData] = useState<Partial<CreateWatchPartyEventData>>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      if (initialData.movie) {
        setSelectedMovie(initialData.movie);
        setSearchQuery(initialData.movie.title);
      }
      setFormData({
        start_time: initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
        recurrence: initialData.recurrence || '',
        max_participants: initialData.max_participants || 100,
        is_featured: initialData.is_featured || false,
        ticket_price: initialData.ticket?.price || 0,
        ticket_description: initialData.ticket?.description || '',
      });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_featured: checked }));
  };

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!selectedMovie) newErrors.movie = 'Please select a movie';
    if (!formData.start_time) newErrors.startTime = 'Start time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: CreateWatchPartyEventData = {
      movie_id: selectedMovie!.id,
      start_time: new Date(formData.start_time!).toISOString(),
      recurrence: formData.recurrence,
      max_participants: Number(formData.max_participants),
      is_featured: formData.is_featured,
      ticket_price: Number(formData.ticket_price),
      ticket_description: formData.ticket_description,
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
          <Input id="start_time" type="datetime-local" value={formData.start_time} onChange={handleInputChange} />
          {errors.startTime && <p className="text-red-500">{errors.startTime}</p>}
        </div>
        {/* <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" type="datetime-local" value={formData.end_time} onChange={handleInputChange} />
          {errors.endTime && <p className="text-red-500">{errors.endTime}</p>}
        </div> */}
      </div>
      {errors.time && <p className="text-red-500">{errors.time}</p>}

      <div>
        <Label htmlFor="recurrence">Recurrence (optional, e.g., &apos;every day&apos;, &apos;every monday&apos;)</Label>
        <Input id="recurrence" value={formData.recurrence} onChange={handleInputChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input id="max_participants" type="number" value={formData.max_participants} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="ticket_price">Ticket Price</Label>
          <Input id="ticket_price" type="number" value={formData.ticket_price} onChange={handleInputChange} />
        </div>
      </div>

      <div>
        <Label htmlFor="ticket_description">Ticket Description</Label>
        <Textarea id="ticket_description" value={formData.ticket_description} onChange={handleInputChange} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="is_featured">Featured Event</Label>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : (initialData ? 'Update Event' : 'Create Event')}
      </Button>
    </form>
  );
}

