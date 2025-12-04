/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WatchPartyForm from '@/components/admin/WatchPartyForm/WatchPartyForm';
import { adminApi, type CreateWatchPartyEventData, WatchParty } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';
import WatchPartyTable from '@/components/admin/WatchPartyList/WatchPartyTable';
import WatchPartyFilters from '@/components/admin/WatchPartyList/WatchPartyFilters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdminWatchPartiesPage() {
  const router = useRouter();
  const toast = useToast();
  const [filters, setFilters] = useState({ is_featured: false });
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<WatchParty | null>(null);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCreateSubmit = async (data: CreateWatchPartyEventData) => {
    try {
      const res = await adminApi.createWatchPartyEvent(data);
      if (res.success) {
        toast.success('Successfully created watch party event');
        setCreateModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to create watch party event');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create watch party event';
      toast.error(message);
    }
  };

  const handleEdit = (party: WatchParty) => {
    setSelectedParty(party);
    setEditModalOpen(true);
  };

  const handleDelete = (party: WatchParty) => {
    setSelectedParty(party);
    setDeleteModalOpen(true);
  };

  const handleUpdateSubmit = async (data: CreateWatchPartyEventData) => {
    if (!selectedParty) return;
    try {
      const res = await adminApi.updateWatchParty(selectedParty.id, data);
      if (res.success) {
        toast.success('Successfully updated watch party event');
        setEditModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to update watch party event');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update watch party event';
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async (deleteType: 'single' | 'series') => {
    if (!selectedParty) return;
    try {
      const res = await adminApi.deleteWatchParty(selectedParty.id, deleteType);
      if (res.success) {
        toast.success('Successfully deleted watch party event');
        setDeleteModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to delete watch party event');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete watch party event';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Watch Party Management</h1>
          <p className="text-gray-400">
            Manage all watch party events.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Watch Party Event</DialogTitle>
            </DialogHeader>
            <WatchPartyForm onSubmit={handleCreateSubmit} submitting={false} />
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WatchPartyFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <WatchPartyTable filters={filters} onEdit={handleEdit} onDelete={handleDelete} />
      </motion.div>

      {selectedParty && (
        <>
          <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Watch Party Event</DialogTitle>
              </DialogHeader>
              <WatchPartyForm
                onSubmit={handleUpdateSubmit}
                submitting={false}
                initialData={selectedParty}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Watch Party Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>Are you sure you want to delete this event?</p>
                {selectedParty.recurrence && (
                  <div className="flex flex-col space-y-2">
                    <Button variant="destructive" onClick={() => handleDeleteConfirm('single')}>
                      Delete only this event
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteConfirm('series')}>
                      Delete the entire series
                    </Button>
                  </div>
                )}
                {!selectedParty.recurrence && (
                  <Button variant="destructive" onClick={() => handleDeleteConfirm('single')}>
                    Delete Event
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

