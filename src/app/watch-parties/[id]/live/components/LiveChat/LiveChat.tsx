"use client";

import React, { useState, useRef, useEffect } from "react";
import { SendMessagePayload } from "@/types/watch-party";
import { useWatchPartyState } from "../../context/WatchPartyContext";
import { useWatchPartySocket } from "../../hooks/useWatchPartySocket";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/zustand";

export default function LiveChat() {
  const { messages, party } = useWatchPartyState();
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user: currentUser } = useAuthStore();

  // Get socket to send messages (get partyId from party)
  const partyId = party?.id || "";
  const { socket } = useWatchPartySocket(partyId);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit("watch_party:message", {
        roomId: partyId,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="relative bg-[#0c0c0e] p-4 rounded-xl h-full flex flex-col border border-[#222] shadow-xl">
      <h2 className="text-lg font-semibold mb-4 text-[#d6d6d6] tracking-wide">
        Live Chat
      </h2>

      {/* Chat list */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar"
      >
        {/* Placeholder khi không có message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            className="flex flex-col items-center justify-center text-center text-gray-500 mt-10 select-none"
          >
            <Send size={32} className="opacity-30 mb-3" />
            <p className="text-sm max-w-[260px] leading-relaxed">
              Hãy gửi lời chào hoặc chia sẻ cảm xúc của bạn để cuộc trò chuyện trở nên thú vị hơn!
            </p>
          </motion.div>
        )}

        {/* Danh sách tin nhắn */}
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isSelf = msg.user?.id === currentUser?.id;

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3"
              >
                <Avatar className="h-9 w-9 border border-gray-800 shadow-sm">
                  <AvatarImage src={msg.user?.avatar || "/default-avatar.png"} />
                  <AvatarFallback className="text-sm">
                    {msg.user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-200 text-sm">
                      {msg.user?.username}
                    </span>

                    <span className="text-[11px] text-gray-500">
                      {formatDistanceToNow(msg.real_time, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div
                    className={`mt-1 px-4 py-2 rounded-2xl max-w-[360px] text-sm shadow-sm border ${isSelf
                      ? "bg-[#232c4e] border-[#2f3b66] text-blue-200"
                      : "bg-[#151518] border-[#2a2a2d] text-gray-200"
                      }`}
                  >
                    {msg.content.message}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="mt-5 flex space-x-3 bottom-4 absolute left-4 right-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#111214] border-[#2a2a2d] text-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 shadow-inner"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl shadow-lg"
        >
          <Send size={18} />
        </Button>
      </form>

      <style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #34343a;
    border-radius: 999px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
`}</style>

    </div>
  );
}
