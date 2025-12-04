"use client";

import Cookies from "js-cookie";
import Hls from "hls.js";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useWatchPartyState } from "../../context/WatchPartyContext";
import { useWatchPartySocket } from "../../hooks/useWatchPartySocket";
import { ANTI_DESYNC_CONFIG, LIVE_VIDEO_CONFIG } from "@/types/watch-party";

/**
 * Live Video Player Component
 * 
 * Handles HLS stream playback with automatic synchronization for multi-client watch parties.
 * - Supports HLS.js for non-Safari browsers and native HLS for Safari
 * - Implements anti-desync logic with configurable threshold
 * - Host sends periodic progress updates; clients listen and re-sync if needed
 * - On join: calculates current playback position based on startTime and seeks to it
 * 
 * Architecture:
 * 1. Connection: When component mounts and streamUrl is available, initializes HLS player
 * 2. Sync on Join: If isPlaying=true, calculates position and seeks; otherwise pauses
 * 3. Playback Control: Host emits events; all clients receive and apply them
 * 4. Anti-desync: Client periodically checks if position drifts > threshold and seeks back
 * 5. Cleanup: Destroys HLS instance and clears listeners on unmount
 */
export default function LiveVideoPlayer({
  partyId,
  externalVideoRef,
  useCustomControls = false,
}: {
  partyId: string;
  externalVideoRef?: React.RefObject<HTMLVideoElement | null>;
  useCustomControls?: boolean;
}) {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = externalVideoRef ?? internalRef;
  const hlsRef = useRef<Hls | null>(null);

  // From context: playback state, participants, messages, etc.
  const { streamUrl, startTime, isPlaying, progress, isHost, lastSyncTimestamp } =
    useWatchPartyState();

  // Socket emitters for host
  const { isConnected, emitPlay, emitPause, emitSeek, emitStart, emitProgressUpdate } =
    useWatchPartySocket(partyId);

  // Local player state
  const [hlsReady, setHlsReady] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const progressUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const desyncCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    console.debug(`[LiveVideoPlayer] isPlaying=${isPlaying}, startTime=${startTime}, progress=${progress}`)
  }, [isPlaying])

  /**
   * Calculate current playback position based on startTime
   * Only valid when isPlaying=true
   * 
   * Formula: (now - startTime) / 1000 = seconds
   * Accounts for host->client network latency by checking server progress
   */
  const calculateCurrentPosition = useCallback((): number => {
    if (!startTime || !isPlaying) {
      return progress; // Fall back to last known progress
    }
    // startTime: milliseconds, result should be seconds
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    return Math.max(0, elapsedSeconds);
  }, [startTime, isPlaying, progress]);

  /**
   * Check for desynchronization and seek if needed
   * Threshold: ANTI_DESYNC_CONFIG.THRESHOLD_SECONDS
   */
  const checkAndFixDesync = useCallback(() => {
    if (!videoRef.current || !isPlaying) return;

    const expectedPosition = calculateCurrentPosition();
    const actualPosition = videoRef.current.currentTime;
    const drift = Math.abs(expectedPosition - actualPosition);

    if (drift > ANTI_DESYNC_CONFIG.THRESHOLD_SECONDS) {
      console.warn(
        `[LiveVideoPlayer] Desync detected: drift=${drift.toFixed(2)}s, seeking from ${actualPosition.toFixed(2)}s to ${expectedPosition.toFixed(2)}s`
      );
      try {
        videoRef.current.currentTime = expectedPosition;
      } catch (err) {
        console.error("[LiveVideoPlayer] Error seeking during desync fix:", err);
      }
    }
  }, [isPlaying, calculateCurrentPosition]);

  /**
   * Initialize HLS player when streamUrl changes
   * Supports both HLS.js (Chrome, Firefox, etc.) and native (Safari)
   */
  useEffect(() => {
    if (!streamUrl || !videoRef.current) {
      console.log("[LiveVideoPlayer] Waiting for streamUrl or videoRef");
      return;
    }
    console.log(streamUrl);

    // Cleanup existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
      setHlsReady(false);
    }

    try {
      if (Hls.isSupported()) {
        console.log("[LiveVideoPlayer] Using HLS.js");

        const token = Cookies.get('access_token');

        const hls = new Hls({
          lowLatencyMode: false,
          backBufferLength: LIVE_VIDEO_CONFIG.BACK_BUFFER_SECONDS,
          maxBufferLength: LIVE_VIDEO_CONFIG.MAX_BUFFER_LENGTH_SECONDS,
          maxMaxBufferLength: LIVE_VIDEO_CONFIG.MAX_BUFFER_LENGTH_SECONDS * 2,
          xhrSetup: (xhr, url) => {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
        });


        hlsRef.current = hls;

        // Load source
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);

        // Manifest loaded: manifest is now available
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("[LiveVideoPlayer] Manifest parsed, attempting to play");
          setHlsReady(true);

          // Sync playback position
          if (isPlaying && startTime) {
            const position = calculateCurrentPosition();
            videoRef.current!.currentTime = position;
            videoRef.current!
              .play()
              .catch((err) => console.error("[LiveVideoPlayer] Play failed:", err));
          } else {
            videoRef.current!.currentTime = progress;
            // Pause and wait for host to start
            videoRef.current!.pause();
          }
        });

        // Handle errors
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("[LiveVideoPlayer] HLS.js error:", data);
          setPlayerError(`HLS error: ${data.type}`);
        });

        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          setIsBuffering(false);
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("[LiveVideoPlayer] Using native HLS (Safari)");
        // Safari native HLS support
        videoRef.current.src = streamUrl;
        setHlsReady(true);

        // Sync playback position
        if (isPlaying && startTime) {
          const position = calculateCurrentPosition();
          videoRef.current.currentTime = position;
          videoRef.current
            .play()
            .catch((err) => console.error("[LiveVideoPlayer] Play failed:", err));
        } else {
          videoRef.current.currentTime = progress;
          videoRef.current.pause();
        }
      } else {
        setPlayerError("HLS playback not supported in this browser");
      }
    } catch (err) {
      console.error("[LiveVideoPlayer] Failed to initialize HLS:", err);
      setPlayerError(`Init error: ${(err as Error).message}`);
    }

    return () => {
      // Cleanup on unmount or streamUrl change
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, isPlaying, startTime, progress, calculateCurrentPosition]);

  /**
   * Handle manual seeking by user (non-host)
   * Host can seek anytime; non-hosts can only seek within already-downloaded range
   */
  const handleSeeking = useCallback(() => {
    const v = videoRef.current;
    if (!v || !isPlaying) return;

    const newPosition = v.currentTime;
    console.log(`[LiveVideoPlayer] User seeked to ${newPosition.toFixed(2)}s`);

    // Only host can initiate seeks
    if (isHost && emitSeek) {
      emitSeek(newPosition);
    }
  }, [isPlaying, isHost, emitSeek]);

  /**
   * Handle play button
   */
  const handlePlay = useCallback(() => {
    if (!isHost) return;
    console.log("[LiveVideoPlayer] Host clicked play");

    if (videoRef.current) {
      // If not yet started, emit 'start' with current server time
      if (!startTime) {
        const nowMs = Date.now();
        emitStart(nowMs);
        // Local playback will sync once startTime is updated in context
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        // Already playing or resuming from pause
        emitPlay(videoRef.current.currentTime);
        videoRef.current.play();
      }
    }
  }, [isHost, startTime, emitStart, emitPlay]);

  /**
   * Handle pause button
   */
  const handlePause = useCallback(() => {
    if (!isHost) return;
    console.log("[LiveVideoPlayer] Host clicked pause");

    if (videoRef.current) {
      videoRef.current.pause();
      emitPause(videoRef.current.currentTime);
    }
  }, [isHost, emitPause]);

  /**
   * Apply play broadcast from host
   */
  useEffect(() => {
    if (videoRef.current && isPlaying && hlsReady) {
      console.debug(`[LiveVideoPlayer] Playing from ${videoRef.current.currentTime.toFixed(2)}s`)
      videoRef.current
        .play()
        .catch((err) => console.error("[LiveVideoPlayer] Auto-play failed:", err));
    }
  }, [isPlaying, hlsReady]);

  /**
   * Apply pause broadcast from host
   */
  useEffect(() => {
    if (videoRef.current && !isPlaying && hlsReady) {
      videoRef.current.pause();
    }
  }, [isPlaying, hlsReady]);

  /**
   * Sync position when startTime changes (host starts playback)
   */
  useEffect(() => {
    if (!videoRef.current || !isPlaying || !hlsReady || !startTime) return;

    const targetPosition = calculateCurrentPosition();
    const currentPosition = videoRef.current.currentTime;

    // Only seek if difference is significant (not just rounding/buffering delay)
    if (Math.abs(targetPosition - currentPosition) > 0.5) {
      console.log(
        `[LiveVideoPlayer] Syncing position: ${currentPosition.toFixed(2)}s -> ${targetPosition.toFixed(2)}s`
      );
      try {
        videoRef.current.currentTime = targetPosition;
      } catch (err) {
        console.error("[LiveVideoPlayer] Error syncing position:", err);
      }
    }
  }, [startTime, isPlaying, hlsReady, calculateCurrentPosition, lastSyncTimestamp]);

  /**
   * Host: periodically send progress updates for anti-desync
   */
  useEffect(() => {
    if (!isHost || !isPlaying) {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
        progressUpdateIntervalRef.current = null;
      }
      return;
    }

    progressUpdateIntervalRef.current = setInterval(() => {
      if (videoRef.current && emitProgressUpdate) {
        emitProgressUpdate(videoRef.current.currentTime);
      }
    }, ANTI_DESYNC_CONFIG.PROGRESS_UPDATE_INTERVAL_MS);

    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
      }
    };
  }, [isHost, isPlaying, emitProgressUpdate]);

  /**
   * Client: periodically check for desynchronization
   */
  useEffect(() => {
    if (!isPlaying || isHost) {
      if (desyncCheckIntervalRef.current) {
        clearInterval(desyncCheckIntervalRef.current);
        desyncCheckIntervalRef.current = null;
      }
      return;
    }

    desyncCheckIntervalRef.current = setInterval(() => {
      checkAndFixDesync();
    }, ANTI_DESYNC_CONFIG.CLIENT_CHECK_INTERVAL_MS);

    return () => {
      if (desyncCheckIntervalRef.current) {
        clearInterval(desyncCheckIntervalRef.current);
      }
    };
  }, [isPlaying, isHost, checkAndFixDesync]);

  /**
   * Calculate display metrics for UI
   */
  const currentDisplayPosition = videoRef.current?.currentTime || 0;
  const delaySeconds = Math.max(
    0,
    Number((calculateCurrentPosition() - currentDisplayPosition).toFixed(1))
  );

  const statusLabel = useMemo(() => {
    if (!hlsReady) return "Loading...";
    if (playerError) return `Error: ${playerError}`;
    if (!isPlaying) return "Paused";
    if (isBuffering) return "Buffering...";
    return "LIVE";
  }, [hlsReady, playerError, isPlaying, isBuffering]);

  return (
    <div className="w-full aspect-video relative bg-black rounded-lg overflow-hidden">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls={!useCustomControls}
        onSeeking={handleSeeking}
        onPlay={handlePlay}
        onPause={handlePause}
      />

      {/* Status indicator overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {/* Status badge */}
        <div
          className={`px-3 py-1 rounded text-white text-sm font-medium ${playerError
            ? "bg-red-600"
            : isPlaying
              ? "bg-red-500"
              : "bg-gray-600"
            }`}
        >
          {statusLabel}
        </div>

        {/* Delay indicator (visible when desync is being managed) */}
        {isPlaying && !isHost && Number(delaySeconds) > 0.1 && (
          <div className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">
            Delay: {delaySeconds}s
          </div>
        )}
      </div>

      {/* Error message */}
      {playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-white text-center">
            <p className="font-semibold mb-2">Playback Error</p>
            <p className="text-sm">{playerError}</p>
          </div>
        </div>
      )}

      {/* Buffering indicator */}
      {isBuffering && !playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Buffering...</p>
          </div>
        </div>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 text-white text-xs bg-black/50 p-2 rounded max-w-xs">
          <p>
            Host: {isHost ? "Yes" : "No"} | Position: {currentDisplayPosition.toFixed(2)}s |
            StartTime: {startTime ? new Date(startTime).toISOString().split("T")[1] : "null"}
          </p>
        </div>
      )}
    </div>
  );
}
