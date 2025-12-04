"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useWatchPartyDispatch } from "../context/WatchPartyContext";
import {
  WatchPartyRoomState,
  WatchPartyStartPayload,
  WatchPartySeekPayload,
  WatchPartyProgressUpdatePayload,
} from "@/types/watch-party";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

/**
 * Hook to manage WebSocket connection for watch party.
 * Handles joining room, receiving broadcasts, and sending socket events.
 * 
 * Socket contract:
 * - Listens: watch_party:join_response, watch_party:play_broadcast, watch_party:pause_broadcast,
 *   watch_party:seek_broadcast, watch_party:progress_broadcast, watch_party:user_joined, etc.
 * - Emits: watch_party:join, watch_party:play, watch_party:pause, watch_party:seek, watch_party:progress_update
 */
export const useWatchPartySocket = (partyId: string) => {
  const dispatch = useWatchPartyDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Utility to extract JWT token from cookies
   */
  const getAuthToken = useCallback((): string | null => {
    if (typeof document === 'undefined') return null;
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    return token || null;
  }, []);

  useEffect(() => {
    // Always attempt to connect to the namespace. If token exists include it in auth,
    // otherwise connect unauthenticated to allow receiving public metadata (backend supports JWT WebSocket auth)
    if (!partyId) return;

    const token = getAuthToken();
    const socket = io(`${SOCKET_URL}/watch-party`, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("[WatchParty] Socket connected,", partyId);
      setIsConnected(true);
      // Note: do not auto-emit join here. Control join explicitly via joinRoom().
    });

    socket.on("disconnect", () => {
      console.log("[WatchParty] Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[WatchParty] Connection error:", error);
      dispatch({ type: "SET_ERROR", payload: `Connection error: ${error.message}` });
    });

    // Initial room state when joining (or when server pushes public metadata)
    socket.on("watch_party:join_response", (state: WatchPartyRoomState) => {
      console.log("[WatchParty] Received join_response:", state);
      // Get current user ID to determine if this client is the host
      const currentUserId = localStorage.getItem('userId') || '';
      const isHost = state.hostId === currentUserId;
      dispatch({
        type: "SET_PARTY_DETAILS",
        payload: {
          party: null as any, // Will be populated from existing context
          messages: state.messages as any,
          participants: state.participants,
          streamUrl: state.streamUrl,
          startTime: state.startTime,
          progress: state.progress || 0,
          isHost: isHost, // Compare with actual host ID ✓
          total_likes: state.totalLikes,
        },
      });
    });

    // Expose explicit join/leave functionality via methods below

    // Broadcast: Host started playback
    socket.on("watch_party:play_broadcast", (data: WatchPartyStartPayload) => {
      console.log("[WatchParty] Play broadcast received:", data);
      dispatch({ type: "PLAY_BROADCAST", payload: data });
    });

    // Broadcast: Host paused playback
    socket.on("watch_party:pause_broadcast", (data: { position: number }) => {
      console.log("[WatchParty] Pause broadcast received:", data);
      dispatch({ type: "PAUSE_BROADCAST", payload: data });
    });

    // Broadcast: Host seeked
    socket.on("watch_party:seek_broadcast", (data: WatchPartySeekPayload) => {
      console.log("[WatchParty] Seek broadcast received:", data);
      dispatch({ type: "SEEK_BROADCAST", payload: data });
    });

    // Broadcast: Progress update for anti-desync
    socket.on("watch_party:progress_broadcast", (data: WatchPartyProgressUpdatePayload) => {
      console.log("[WatchParty] Progress update received:", data);
      dispatch({ type: "PROGRESS_UPDATE", payload: data });
    });

    // Broadcast: User joined
    socket.on("watch_party:user_joined", (user) => {
      console.log("[WatchParty] User joined:", user);
      dispatch({ type: "USER_JOIN", payload: user });
    });

    // Broadcast: User left
    socket.on("watch_party:user_left", (data: { userId: string }) => {
      console.log("[WatchParty] User left:", data);
      dispatch({ type: "USER_LEAVE", payload: { id: data.userId } });
    });

    // Chat message
    socket.on("watch_party:message", (msg) => {
      console.log("[WatchParty] New message:", msg);
      dispatch({ type: "ADD_MESSAGE", payload: msg });
    });

    // Like reaction
    socket.on("watch_party:like", (data: { userId: string }) => {
      console.log("[WatchParty] Like received:", data);
      dispatch({ type: "USER_LIKE", payload: data });
    });

    // Error events
    socket.on("watch_party:error", (data: { code: string; message: string }) => {
      console.error("[WatchParty] Socket error:", data);
      dispatch({ type: "SET_ERROR", payload: data.message });
    });

    return () => {
      socket.disconnect();
    };
  }, [partyId, dispatch, getAuthToken]);

  /**
   * Emit play event (host only)
   * Starts playback from current position
   */
  const emitPlay = useCallback((position: number = 0) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("watch_party:play", { roomId: partyId, position });
    }
  }, [partyId]);

  /**
   * Explicitly join the watch party room. Call only when user is authenticated
   * and has permissions to join (e.g., purchased).
   */
  const joinRoom = useCallback(() => {
    if (!socketRef.current) return;
    if (!socketRef.current.connected) {
      console.warn('[WatchParty] joinRoom called but socket not connected yet');
      return;
    }
    console.log(`Joining room ${partyId}...`)
    socketRef.current.emit('watch_party:join', { roomId: partyId });
  }, [partyId]);

  const leaveRoom = useCallback(() => {
    if (!socketRef.current) return;
    if (!socketRef.current.connected) return;
    socketRef.current.emit('watch_party:leave', { roomId: partyId });
  }, [partyId]);

  /**
   * Emit pause event (host only)
   */
  const emitPause = useCallback((position: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("watch_party:pause", { roomId: partyId, position });
    }
  }, [partyId]);

  /**
   * Emit seek event (host only)
   */
  const emitSeek = useCallback((position: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("watch_party:seek", { roomId: partyId, position });
    }
  }, [partyId]);

  /**
   * Emit start event (host only)
   * Initiates playback with server-synchronized timestamp
   */
  const emitStart = useCallback((startTime: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("watch_party:start", { roomId: partyId, startTime });
    }
  }, [partyId]);

  /**
   * Emit progress update (host only)
   * Sends periodically to help clients stay in sync
   */
  const emitProgressUpdate = useCallback((progress: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("watch_party:progress_update", {
        roomId: partyId,
        progress,
        timestamp: Date.now(),
      });
    }
  }, [partyId]);

  return {
    isConnected,
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    // Host-only emitters
    emitPlay,
    emitPause,
    emitSeek,
    emitStart,
    emitProgressUpdate,
  };
};
