"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WatchPartyForm from '@/components/admin/WatchPartyForm/WatchPartyForm';
import { adminApi, type CreateWatchPartyEventData } from '@/apis/admin.api';
import { useToast } from '@/hooks/useToast';

export default function AdminWatchPartiesPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: CreateWatchPartyEventData) => {
    try {
      setSubmitting(true);
      const res = await adminApi.createWatchPartyEvent(data);

      if (res.success) {
        const count = Array.isArray(res.data) ? res.data.length : 1;
        toast.success(
          `Successfully created ${count} watch party event${count !== 1 ? 's' : ''}`
        );
        // Reset form or redirect
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        toast.error(res.message || 'Failed to create watch party event');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create watch party event';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Create Watch Party Event</h1>
        <p className="text-gray-400">
          Create a watch party event that can start immediately, be scheduled for a specific time, or recur daily, weekly, or monthly.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900/60 rounded-lg border border-gray-800 p-6"
      >
        <WatchPartyForm onSubmit={handleSubmit} submitting={submitting} />
      </motion.div>
    </div>
  );
}

