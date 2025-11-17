/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface WatchPartyFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export default function WatchPartyFilters({ filters, onFiltersChange }: WatchPartyFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    onFiltersChange({ ...filters, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    onFiltersChange({ ...filters, [name]: checked });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    onFiltersChange({ ...filters, [name]: date?.toISOString() });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-900/60 rounded-lg border border-gray-800">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="movie_title">Movie Title</Label>
        <Input
          id="movie_title"
          name="movie_title"
          placeholder="Search by movie title..."
          value={filters.movie_title || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <Label htmlFor="event_type">Event Type</Label>
        <Select
          name="event_type"
          value={filters.event_type || 'all'}
          onValueChange={(value) => handleSelectChange('event_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="start_date">Start Date</Label>
        <DatePicker
          selected={filters.start_date ? new Date(filters.start_date) : null}
          onChange={(date) => handleDateChange('start_date', date)}
          className="w-full"
          customInput={<Input />}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="end_date">End Date</Label>
        <DatePicker
          selected={filters.end_date ? new Date(filters.end_date) : null}
          onChange={(date) => handleDateChange('end_date', date)}
          className="w-full"
          customInput={<Input />}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_featured"
          checked={filters.is_featured || false}
          onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
        />
        <Label htmlFor="is_featured">Featured</Label>
      </div>
    </div>
  );
}
