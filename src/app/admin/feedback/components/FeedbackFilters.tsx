"use client";
import React from 'react';

interface FeedbackFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: 'active' | 'hidden' | 'all';
  onStatusChange: (value: 'active' | 'hidden' | 'all') => void;
}

export function FeedbackFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: FeedbackFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-2">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by user name or movie..."
        className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500 md:w-64"
      />
      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.currentTarget.value as 'active' | 'hidden' | 'all')
        }
        className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
  );
}
