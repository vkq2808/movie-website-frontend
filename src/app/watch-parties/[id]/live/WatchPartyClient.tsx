"use client";

import React, { useEffect } from 'react';
import { WatchPartyLiveInfo } from '@/apis/watch-party.api';
import { useWatchPartySocket } from './hooks/useWatchPartySocket';
import { useWatchPartyDispatch, useWatchPartyState } from './context/WatchPartyContext';
import { useVideoSync } from './hooks/useVideoSync';
import LiveVideoControls from './components/LiveVideoControls/LiveVideoControls';
import LiveChat from './components/LiveChat/LiveChat';
import ParticipantsList from './components/ParticipantsList/ParticipantsList';
import { motion } from 'framer-motion';
import LiveVideoPlayer from './components/LiveVideoPlayer/LiveVideoPlayer';

interface WatchPartyClientProps {
  partyId: string;
  /** Whether to render the main LiveVideoPlayer. Main page already renders the player, so pass false to avoid duplicates */
  showPlayer?: boolean;
}

export default function WatchPartyClient({ partyId, showPlayer = true }: WatchPartyClientProps) {

  // Optionally initialize socket here when this component is used standalone
  const socketInfo = useWatchPartySocket(partyId);
  const { emitPlay, emitPause, emitSeek, emitStart } = socketInfo;
  const { isLoading, error, isHost, isPlaying, progress } = useWatchPartyState();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const { onHostPlay, onHostPause, onHostSeek } = useVideoSync({
    videoRef,
    isHost,
    emitPlay,
    emitPause,
    emitSeek,
    emitStart,
  });



  if (isLoading && !socketInfo.isConnected) {
    return <div className="text-center p-8">Loading Watch Party...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  // If rendering the player here, wire local videoRef + controls
  if (showPlayer) {

    // Grab emitters from the optional socket instance

    return (
      <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="gap-4 h-full"
        >
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            <div className="w-full">
              <LiveVideoPlayer partyId={partyId} externalVideoRef={videoRef} useCustomControls />
            </div>
            <div className="flex-1 hidden lg:block">
              <ParticipantsList />
            </div>
          </div>
          <div className="lg:col-span-1">
            <LiveChat />
          </div>
        </motion.div>

        <div className="mt-3">
          <LiveVideoControls
            isHost={isHost}
            playing={isPlaying}
            progress={progress}
            onPlay={onHostPlay}
            onPause={onHostPause}
            onSeek={onHostSeek}
          />
        </div>
      </div>
    );
  }

  // Default: render sidebar-only view
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full"
      >
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 hidden lg:block">
            <ParticipantsList />
          </div>
        </div>
        <div className="lg:col-span-1">
          <LiveChat />
        </div>
      </motion.div>
    </div>
  );
}
