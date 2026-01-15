"use client";

import { Users } from "lucide-react";

interface Participant {
  id: string;
  username: string;
  avatar?: string;
}

interface ParticipantsListProps {
  participants: Participant[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333333]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[#e50914]" />
        <h3 className="text-white font-bold">
          Đang xem ({participants.length})
        </h3>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#0b0b0b] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#e50914] flex items-center justify-center text-white font-bold">
              {participant.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm">{participant.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
