'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Users } from 'lucide-react';
import { SyncedVideoPlayer } from '@/components/watch-party/SyncedVideoPlayer';
import { ChatBox } from '@/components/watch-party/ChatBox';
import { useWatchPartySocket } from '@/hooks/useWatchPartySocket';
import { watchPartyApi, type WatchParty, type WatchPartyLog } from '@/apis/watch-party.api';

export default function LiveWatchPartyPage() {
  const params = useParams();
  const [party, setParty] = useState<WatchParty | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLogs, setInitialLogs] = useState<WatchPartyLog[]>([]);

  // Mock current user - should come from auth context
  const currentUser = {
    id: 'user-1',
    username: 'Demo User',
  };

  const {
    isConnected,
    messages,
    participants,
    playerSync,
    sendMessage,
    sendPlayerAction,
  } = useWatchPartySocket(params.id as string, currentUser.id, currentUser.username, initialLogs.map(log => ({
    userId: log.user?.id || 'system',
    username: log.user?.username || 'System',
    message: log.content.message,
    realTime: log.real_time,
    eventTime: log.event_time,
  })));

  useEffect(() => {
    loadParty();
  }, [params.id]);

  const loadParty = async () => {
    try {
      setLoading(true);
      const data = await watchPartyApi.getLiveInfo(params.id as string);
      setParty(data.watchParty);
      setInitialLogs(data.chats);
    } catch (error) {
      console.error('Failed to load watch party:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    // Calculate event time (seconds from party start)
    const eventTime = party?.start_time
      ? (Date.now() - new Date(party.start_time).getTime()) / 1000
      : 0;
    sendMessage(message, eventTime);
  };

  const handlePlayerAction = (action: 'play' | 'pause' | 'seek', currentTime: number) => {
    const eventTime = party?.start_time
      ? (Date.now() - new Date(party.start_time).getTime()) / 1000
      : 0;
    sendPlayerAction(action, currentTime, eventTime);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-white text-xl">Loading watch party...</div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-white text-xl">Watch party not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{party.movie?.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[#a0a0a0] mt-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{participants.length} watching</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SyncedVideoPlayer
              videoUrl={party.movie?.videos?.[0]?.url || '/demo-video.mp4'}
              onPlayerAction={handlePlayerAction}
              playerSync={playerSync}
            />
          </div>

          <div className="h-[600px]">
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}