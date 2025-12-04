"use client";

import React, { useEffect, useState } from 'react';
import { useWatchPartyDispatch, useWatchPartyState } from '../../context/WatchPartyContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WatchPartyParticipant } from '@/apis/watch-party.api';
import { useDebounce } from '@/hooks/useDebounce';


export default function ParticipantsList() {
  const dispatch = useWatchPartyDispatch();
  const { showing_participant, participants, joining_or_leaving } = useWatchPartyState();
  const debouncedParticipant = useDebounce(showing_participant, 2000);

  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!debouncedParticipant) return;

    setToastVisible(true);
    const timer = setTimeout(() => {
      setToastVisible(false)
    }, 3500);

    return () => clearTimeout(timer);
  }, [debouncedParticipant, joining_or_leaving]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 p-4 rounded-lg h-full relative"
    >
      <h2 className="text-xl font-bold mb-4 text-white">Participants ({participants.length})</h2>

      <div className="space-y-4">
        {participants.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <Avatar>
              <AvatarImage src={p.avatar || '/default-avatar.png'} alt={p.username} />
              <AvatarFallback>{p.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-white">{p.username}</span>
          </motion.div>
        ))}
      </div>

      {/* Toast placeholder */}
      <div className="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
        <AnimatePresence>
          {toastVisible && debouncedParticipant && (
            <Toast
              type={joining_or_leaving}
              username={debouncedParticipant.username}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const Toast = ({ type, username }: { type: 'joining' | 'leaving', username: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium w-fit mx-auto
        ${type === 'joining' ? 'bg-green-600/90' : 'bg-red-600/90'}
      `}
    >
      {type === "joining"
        ? `${username} vừa tham gia`
        : `${username} đã rời đi`}
    </motion.div>
  );
};
