/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { adminApi, WatchParty } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface WatchPartyTableProps {
  filters: any;
  onEdit: (party: WatchParty) => void;
  onDelete: (party: WatchParty) => void;
}

export default function WatchPartyTable({ filters, onEdit, onDelete }: WatchPartyTableProps) {
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchWatchParties = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getWatchParties(filters);
        if (res.success) {
          setWatchParties(res.data.watch_parties);
        } else {
          toast.error(res.message || 'Failed to fetch watch parties');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch watch parties';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchParties();
  }, [filters, toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Movie</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {watchParties?.map((party) => (
          <TableRow key={party.id}>
            <TableCell>{party.movie.title}</TableCell>
            <TableCell>{format(new Date(party.start_time), 'PPpp')}</TableCell>
            <TableCell>{format(new Date(party.end_time), 'PPpp')}</TableCell>
            <TableCell>
              <Badge
                className={clsx({
                  'bg-green-600': party.status === 'upcoming',
                  'bg-blue-600': party.status === 'ongoing',
                  'bg-gray-600': party.status === 'finished',
                })}
              >
                {party.status}
              </Badge>
            </TableCell>
            <TableCell>
              {party.participant_count} / {party.max_participants}
            </TableCell>
            <TableCell>{party.is_featured ? 'Yes' : 'No'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(party)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(party)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
