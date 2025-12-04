'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, useParams } from 'next/navigation';
import { watchPartyApi, WatchPartyLiveInfo } from '@/apis/watch-party.api';
import { WatchPartyProvider } from './context/WatchPartyContext';
import WatchPartyClient from './WatchPartyClient';
import { useWatchPartySocket } from './hooks/useWatchPartySocket';
import LiveVideoPlayer from './components/LiveVideoPlayer/LiveVideoPlayer';
import LiveVideoControls from './components/LiveVideoControls/LiveVideoControls';
import { useVideoSync } from './hooks/useVideoSync';
import { useWatchPartyState } from './context/WatchPartyContext';

export default function WatchPartyLivePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [liveInfo, setLiveInfo] = useState<WatchPartyLiveInfo | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Video element ref to be shared with controls and sync hook
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const token = Cookies.get('access_token');
    setIsAuth(!!token);

    async function load() {
      try {
        // Step 1: fetch watch party live info (source-of-truth for stream metadata)
        const res = await watchPartyApi.getLiveInfo(params.id);
        // API shape may vary; try to normalize to WatchPartyLiveInfo
        const info: WatchPartyLiveInfo = res.data;
        // Some APIs return { data: { watchParty: ... } } - try fallback
        if (!info) {
          try {
            const byId = await watchPartyApi.getById(params.id as string);
            setLiveInfo({ startTime: '', currentTime: 0, messages: [], watchParty: byId, participants: [], total_likes: { total: 0 } });
          } catch (err) {
            console.error('Error fetching watch party by id fallback', err);
            setLiveInfo(null);
          }
        } else {
          setLiveInfo(info as WatchPartyLiveInfo);
        }

        // Step 2: only after watchParty metadata is available, fetch user purchases if authenticated
        if (token && liveInfo === null) {
          // If we just set liveInfo from this response above, use that; else attempt getMyPurchases
        }

        if (token) {
          try {
            const purchases = await watchPartyApi.getMyPurchases();
            const purchased = purchases?.some((p: any) => p.watch_party?.id === params.id) ?? false;
            setHasPurchased(purchased || (info && (info as any).watchParty?.has_purchased));
          } catch (err) {
            console.warn('Could not fetch purchases:', err);
            // fallback to liveInfo.watchParty.has_purchased if present
            setHasPurchased((info as any)?.watchParty?.has_purchased ?? false);
          }
        } else {
          setHasPurchased(false);
        }
      } catch (error) {
        console.error('Error loading watch party:', error);
        setLiveInfo(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id, router]);

  // NOTE: socket hook depends on WatchPartyProvider (it dispatches into context).
  // We'll initialize the socket and wire controls inside an inner component
  // that is rendered within the provider below.

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        Loading Watch Party...
      </div>
    );
  }

  if (!liveInfo) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h1 className="text-2xl font-bold">Failed to load Watch Party</h1>
        <p>This event may not exist or an error occurred.</p>
      </div>
    );
  }

  return (
    <WatchPartyProvider>
      <MainWatchPartyContent
        partyId={params.id as string}
        videoRef={videoRef}
        isAuth={isAuth}
        hasPurchased={hasPurchased}
        liveInfo={liveInfo}
      />
    </WatchPartyProvider>
  );
}

// Join room when socket connected and user is authenticated and has purchase
// (we keep this outside the component render for clarity)
function useAutoJoin(
  socketConnected: boolean,
  joinRoom?: () => void,
  isAuth?: boolean,
  hasPurchased?: boolean,
  liveInfo?: WatchPartyLiveInfo | null,
) {
  useEffect(() => {
    if (!joinRoom) {
      console.log('useAutoJoin: joinRoom not defined. check if useSocket is mounted')
      return;
    }
    if (!socketConnected) {
      console.log('useAutoJoin: socket not connected. check if useSocket is mounted')
      return;
    }
    if (!liveInfo) {
      console.log('useAutoJoin: liveInfo:', liveInfo)
      return;
    }
    if (!isAuth) {
      console.log('useAutoJoin: isAuth:', isAuth)
      return;
    }
    if (!hasPurchased) {
      console.log('useAutoJoin: hasPurchased:', hasPurchased)
      return;
    }
    try {
      joinRoom();
    } catch (err) {
      console.warn('useAutoJoin: joinRoom failed', err);
    }
  }, [socketConnected, joinRoom, isAuth, hasPurchased, liveInfo]);
}

/**
 * Inner component that is mounted inside `WatchPartyProvider` so hooks that
 * depend on the watch-party context can be used safely.
 */
function MainWatchPartyContent({
  partyId,
  videoRef,
  isAuth,
  hasPurchased,
  liveInfo,
}: {
  partyId: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isAuth: boolean;
  hasPurchased: boolean;
  liveInfo: any;
}) {
  // Socket + emitters (connects even if unauthenticated)
  const { isConnected: socketConnected, joinRoom, emitPlay, emitPause, emitSeek, emitStart } =
    useWatchPartySocket(partyId);

  // Watch party state from context
  const { isHost, isPlaying, progress } = useWatchPartyState();

  // Wire video sync: host handlers and viewer apply-state logic
  const { onHostPlay, onHostPause, onHostSeek } = useVideoSync({
    videoRef,
    isHost,
    emitPlay,
    emitPause,
    emitSeek,
    emitStart,
  });

  // Auto-join when all conditions are met
  useAutoJoin(socketConnected, joinRoom, isAuth, hasPurchased, liveInfo);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Player area */}
          <LiveVideoPlayer partyId={partyId} externalVideoRef={videoRef} useCustomControls />

          {/* Custom controls wired to video sync; viewers see disabled controls */}
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
        {/* <div>
          <WatchPartyClient partyId={partyId} showPlayer={false} />
        </div> */}
      </div>
    </div>
  );
}
