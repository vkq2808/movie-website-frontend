"use client";

import { useCallback, useEffect } from "react";
import { useWatchPartyState } from "../context/WatchPartyContext";

type VideoRef = React.RefObject<HTMLVideoElement | null> | null;

/**
 * Hook that centralizes host-as-source-of-truth playback control.
 * - Host actions call socket emitters (provided by useWatchPartySocket)
 * - Viewers only update playback based on room state from context
 */
export function useVideoSync({
  videoRef,
  isHost,
  emitPlay,
  emitPause,
  emitSeek,
  emitStart,
}: {
  videoRef: VideoRef;
  isHost: boolean;
  emitPlay?: (position: number) => void;
  emitPause?: (position: number) => void;
  emitSeek?: (position: number) => void;
  emitStart?: (startTimeMs: number) => void;
}) {
  const state = useWatchPartyState();

  const calculateCurrentPosition = useCallback(() => {
    const { startTime, isPlaying, progress } = state;
    if (!startTime || !isPlaying) return progress;
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    return Math.max(0, elapsedSeconds);
  }, [state]);

  // Viewer: apply server state changes to the media element
  useEffect(() => {
    if (!videoRef || !videoRef.current) return;
    if (isHost) return; // Host controls their own player locally

    const desired = calculateCurrentPosition();
    const current = videoRef.current.currentTime;

    // If significant difference, seek to server position
    if (Math.abs(desired - current) > 0.6) {
      try {
        videoRef.current.currentTime = desired;
      } catch (err) {
        console.warn("useVideoSync: failed to seek viewer to server position", err);
      }
    }

    // Play/pause according to server state
    if (state.isPlaying) {
      videoRef.current
        .play()
        .catch(() => {
          /* ignore autoplay block for viewers */
        });
    } else {
      try {
        videoRef.current.pause();
      } catch (err) {
        /* noop */
      }
    }
  }, [state.isPlaying, state.startTime, state.progress, videoRef, isHost, calculateCurrentPosition]);

  // Host control handlers
  const onHostPlay = useCallback(() => {
    if (!isHost || !videoRef?.current) return;
    const v = videoRef.current;
    // If starting fresh, emit start with server time; otherwise emit play with position
    if (!state.startTime) {
      const nowMs = Date.now();
      emitStart?.(nowMs);
      v.currentTime = 0;
      v.play().catch(() => { });
    } else {
      emitPlay?.(v.currentTime);
      v.play().catch(() => { });
    }
  }, [isHost, videoRef, emitStart, emitPlay, state.startTime]);

  const onHostPause = useCallback(() => {
    if (!isHost || !videoRef?.current) return;
    const v = videoRef.current;
    v.pause();
    emitPause?.(v.currentTime);
  }, [isHost, videoRef, emitPause]);

  const onHostSeek = useCallback((position: number) => {
    if (!isHost || !videoRef?.current) return;
    const v = videoRef.current;
    try {
      v.currentTime = position;
    } catch (err) {
      console.warn("useVideoSync: host seek failed", err);
    }
    emitSeek?.(position);
  }, [isHost, videoRef, emitSeek]);

  return {
    onHostPlay,
    onHostPause,
    onHostSeek,
  };
}
