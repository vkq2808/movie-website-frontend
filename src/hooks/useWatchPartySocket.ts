import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  realTime: string;
  eventTime: number;
}

interface PlayerSync {
  action: 'play' | 'pause' | 'seek';
  currentTime: number;
  timestamp: string;
}

interface UserEvent {
  userId: string;
  username: string;
  participantCount: number;
  timestamp: string;
}

export const useWatchPartySocket = (
  partyId: string,
  userId: string,
  username: string,
  initialMessages: ChatMessage[] = [],
) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [participants, setParticipants] = useState<string[]>([]);
  const [playerSync, setPlayerSync] = useState<PlayerSync | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  useEffect(() => {
    if (!partyId || !userId) return;

    // Connect to WebSocket
    const socket = io(`${SOCKET_URL}/watch-party`, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      
      // Join party
      socket.emit('join_party', {
        partyId,
        userId,
        username,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user_joined', (data: UserEvent) => {
      console.log('User joined:', data);
    });

    socket.on('user_left', (data: UserEvent) => {
      console.log('User left:', data);
    });

    socket.on('new_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('sync_player', (sync: PlayerSync) => {
      setPlayerSync(sync);
    });

    socket.on('participant_list', (data: { participants: string[] }) => {
      setParticipants(data.participants);
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_party', {
          partyId,
          userId,
          username,
        });
        socketRef.current.disconnect();
      }
    };
  }, [partyId, userId, username]);

  const sendMessage = (message: string, eventTime: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_message', {
        partyId,
        userId,
        username,
        message,
        eventTime,
      });
    }
  };

  const sendPlayerAction = (action: 'play' | 'pause' | 'seek', currentTime: number, eventTime: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('player_action', {
        partyId,
        userId,
        action,
        currentTime,
        eventTime,
      });
    }
  };

  return {
    isConnected,
    messages,
    participants,
    playerSync,
    sendMessage,
    sendPlayerAction,
  };
};