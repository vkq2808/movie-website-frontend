import { useWatchPartySocket as _useWatchPartySocket } from '@/app/watch-parties/[id]/live/hooks/useWatchPartySocket';

export type RoomState = any;

/**
 * Compatibility wrapper used by older routes importing from `@/hooks/useWatchPartySocket`.
 * It maps the newer hook's API into the older `{ roomState, controls }` shape
 * while preserving direct access to the socket/emitters.
 */
export function useWatchPartySocket(roomId: string) {
  const base = _useWatchPartySocket(roomId);

  const controls = {
    play: base.emitPlay,
    pause: base.emitPause,
    seek: base.emitSeek,
    progress: base.emitProgressUpdate,
  };

  // roomState is provided for compatibility; consumers should migrate to WatchPartyContext
  const roomState: RoomState = {
    // best-effort minimal mapping
    isConnected: base.isConnected,
  };

  return {
    ...base,
    roomState,
    controls,
  };
}

export { _useWatchPartySocket };
