"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  realTime: string;
  eventTime: number;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: {
    id: string;
    username: string;
  };
}

export function ChatBox({
  messages,
  onSendMessage,
  currentUser,
}: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] rounded-lg border border-[#333333]">
      <div className="p-4 border-b border-[#333333]">
        <h3 className="text-white font-bold">Trò chuyện trực tiếp</h3>
        <p className="text-xs text-[#a0a0a0]">{messages.length} tin nhắn</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.userId === currentUser.id;

          return (
            <div
              key={index}
              className={`flex gap-3 ${
                isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {msg.username.charAt(0).toUpperCase()}
              </div>

              <div className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {msg.username}
                  </span>
                  <span className="text-xs text-[#a0a0a0]">
                    {format(new Date(msg.realTime), "HH:mm")}
                  </span>
                </div>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    isCurrentUser
                      ? "bg-[#e50914] text-white"
                      : "bg-[#333333] text-white"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#333333]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-[#0b0b0b] text-white px-4 py-2 rounded-lg border border-[#333333] focus:border-[#e50914] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-[#e50914] hover:bg-[#b8070f] disabled:bg-[#333333] disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
