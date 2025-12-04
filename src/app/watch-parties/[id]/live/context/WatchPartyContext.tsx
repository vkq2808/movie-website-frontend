"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WatchParty, WatchPartyLog, WatchPartyParticipant } from '@/apis/watch-party.api';
import {
  WatchPartyStartPayload,
  WatchPartySeekPayload,
  WatchPartyProgressUpdatePayload,
  ANTI_DESYNC_CONFIG,
} from '@/types/watch-party';

export type WSMessage =
  | { type: 'info'; payload: { party: WatchParty; chats: WatchPartyLog[] } }
  | { type: 'chat'; payload: WatchPartyLog }
  | { type: 'participants'; payload: WatchPartyParticipant[] }
  | { type: 'join'; payload: WatchPartyParticipant }
  | { type: 'leave'; payload: { userId: string } }
  | { type: 'play'; payload: WatchPartyStartPayload }
  | { type: 'pause'; payload: { position: number } }
  | { type: 'seek'; payload: WatchPartySeekPayload }
  | { type: 'progress_update'; payload: WatchPartyProgressUpdatePayload }
  | { type: 'error'; payload: { error: string } };

interface WatchPartyState {
  party: WatchParty | null;
  streamUrl: string;
  participants: WatchPartyParticipant[];
  messages: WatchPartyLog[];
  isPlaying: boolean;
  /** Progress in seconds (video playback position) */
  progress: number;
  /** Start time in milliseconds (Date.now() when playback started). Null if not playing */
  startTime: number | null;
  isLoading: boolean;
  error: string | null;
  total_likes: {
    [user_id: string]: number,
    total: number
  }
  showing_participant?: WatchPartyParticipant;
  joining_or_leaving: 'joining' | 'leaving';
  /** For host: whether to send periodic progress updates */
  isHost: boolean;
  /** Last time progress was synced with host (for anti-desync check) */
  lastSyncTimestamp: number;
}

type Action =
  | {
    type: 'SET_PARTY_DETAILS'; payload: {
      party: WatchParty;
      messages: WatchPartyLog[];
      participants?: WatchPartyParticipant[];
      total_likes?: { [user_id: string]: number, total: number };
      streamUrl: string;
      startTime: number | null;
      progress?: number;
      isHost: boolean;
    }
  }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: WatchPartyLog }
  | { type: 'SET_PARTICIPANTS'; payload: WatchPartyParticipant[] }
  | { type: 'USER_JOIN'; payload: WatchPartyParticipant }
  | { type: 'USER_LEAVE'; payload: { id: string } }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'USER_LIKE'; payload: { userId: string } }
  | { type: 'PLAY_BROADCAST'; payload: WatchPartyStartPayload }
  | { type: 'PAUSE_BROADCAST'; payload: { position: number } }
  | { type: 'SEEK_BROADCAST'; payload: WatchPartySeekPayload }
  | { type: 'PROGRESS_UPDATE'; payload: WatchPartyProgressUpdatePayload }

const initialState: WatchPartyState = {
  party: null,
  streamUrl: '',
  participants: [],
  messages: [],
  isPlaying: false,
  progress: 0,
  startTime: null,
  isLoading: true,
  error: null,
  total_likes: {
    total: 0
  },
  joining_or_leaving: 'joining',
  isHost: false,
  lastSyncTimestamp: Date.now(),
};

const watchPartyReducer = (state: WatchPartyState, action: Action): WatchPartyState => {
  switch (action.type) {
    case 'SET_PARTY_DETAILS':
      return {
        ...state,
        party: action.payload.party,
        messages: action.payload.messages,
        participants: action.payload.participants || [],
        isLoading: false,
        total_likes: action.payload.total_likes || { total: 0 },
        streamUrl: action.payload.streamUrl,
        progress: action.payload.progress || 0,
        startTime: action.payload.startTime,
        isHost: action.payload.isHost,
        lastSyncTimestamp: Date.now(),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_PARTICIPANTS':
      return { ...state, participants: action.payload };
    case 'USER_JOIN':
      if (state.participants.find(p => p.id === action.payload.id)) return state;
      return {
        ...state,
        joining_or_leaving: 'joining',
        showing_participant: action.payload,
        participants: [...state.participants, action.payload]
      };
    case 'USER_LEAVE':
      return {
        ...state,
        showing_participant: state.participants.find(p => p.id !== action.payload.id),
        joining_or_leaving: 'leaving',
        participants: state.participants.filter(p => p.id !== action.payload.id)
      };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'USER_LIKE':
      return {
        ...state,
        total_likes: {
          total: state.total_likes.total + 1,
          [action.payload.userId]: (state.total_likes[action.payload.userId] || 0) + 1
        }
      }
    case 'PLAY_BROADCAST':
      return {
        ...state,
        isPlaying: true,
        startTime: action.payload.startTime,
        lastSyncTimestamp: Date.now(),
      };
    case 'PAUSE_BROADCAST':
      return {
        ...state,
        isPlaying: false,
        progress: action.payload.position,
        startTime: null,
        lastSyncTimestamp: Date.now(),
      };
    case 'SEEK_BROADCAST':
      return {
        ...state,
        progress: action.payload.position,
        lastSyncTimestamp: Date.now(),
      };
    case 'PROGRESS_UPDATE':
      return {
        ...state,
        progress: action.payload.progress,
        lastSyncTimestamp: Date.now(),
      };
    default:
      return state;
  }
};

const WatchPartyStateContext = createContext<WatchPartyState | undefined>(undefined);
const WatchPartyDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export const WatchPartyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(watchPartyReducer, initialState);

  return (
    <WatchPartyStateContext.Provider value={state}>
      <WatchPartyDispatchContext.Provider value={dispatch}>
        {children}
      </WatchPartyDispatchContext.Provider>
    </WatchPartyStateContext.Provider>
  );
};

export const useWatchPartyState = () => {
  const context = useContext(WatchPartyStateContext);
  if (context === undefined) {
    throw new Error('useWatchPartyState must be used within a WatchPartyProvider');
  }
  return context;
};

export const useWatchPartyDispatch = () => {
  const context = useContext(WatchPartyDispatchContext);
  if (context === undefined) {
    throw new Error('useWatchPartyDispatch must be used within a WatchPartyProvider');
  }
  return context;
};
