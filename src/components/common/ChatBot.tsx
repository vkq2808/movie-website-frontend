"use client";
import React from 'react';
import { SendIcon } from 'lucide-react';
import { sendChatMessage } from '@/apis/chat.api';

export default function ChatBot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleSend = async (custom?: string) => {
    const text = (custom ?? input).trim();
    if (!text) return;
    const userText = text;
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    try {
      const res = await sendChatMessage(userText);
      const botMsg = res?.status === 'success' ? res.data.botMessage.message : undefined;
      if (botMsg) {
        setMessages((prev) => [...prev, { role: 'bot', content: String(botMsg) }]);
      } else if (res?.status === 'error') {
        setMessages((prev) => [...prev, { role: 'bot', content: res.error?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.' }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Có lỗi xảy ra, vui lòng thử lại.' }]);
    }
    if (!custom) setInput('');
    setLoading(false);
  };

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  // Accessibility: close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Floating chat icon */}
      {!open && (
        <button
          aria-label="Open chat bot"
          className="fixed bottom-6 right-6 z-[1000] h-14 w-14 rounded-full text-white shadow-[0_8px_28px_rgba(0,0,0,0.28)]
                     bg-gradient-to-br from-[#00B2FF] to-[#006AFF] hover:brightness-110 active:brightness-95
                     flex items-center justify-center"
          onClick={() => setOpen(true)}
        >
          {/* Messenger lightning icon */}
          <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2.04c-5.5 0-9.96 3.98-9.96 8.88 0 2.8 1.48 5.3 3.86 6.98.14.1.22.26.21.43l-.14 2.15c-.02.33.31.57.62.45l2.4-.93c.1-.04.22-.04.32 0 0 0 1.3.36 2.69.36 5.5 0 9.96-3.98 9.96-8.88C21.96 6.02 17.5 2.04 12 2.04Zm4.22 8.9-2.68-1.7c-.18-.12-.42-.08-.56.08l-2.23 2.58c-.12.14-.33.17-.49.07l-2.02-1.24c-.29-.18-.61.17-.41.45l1.79 2.43c.13.18.39.2.55.04l2.41-2.36c.13-.12.33-.14.48-.04l2.95 1.95c.3.2.62-.18.41-.46Z" />
          </svg>
        </button>
      )}
      {/* Chat modal & box */}
      {open && (
        <>
          {/* Mobile overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/40 sm:hidden z-[999]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed z-[1000] bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.28)] flex flex-col
                       w-[95vw] h-[70vh] bottom-2 right-2
                       sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[520px]"
            role="dialog"
            aria-label="Chat Bot"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 rounded-t-2xl
                            bg-gradient-to-br from-[#00B2FF] to-[#006AFF]">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.04c-5.5 0-9.96 3.98-9.96 8.88 0 2.8 1.48 5.3 3.86 6.98.14.1.22.26.21.43l-.14 2.15c-.02.33.31.57.62.45l2.4-.93c.1-.04.22-.04.32 0 0 0 1.3.36 2.69.36 5.5 0 9.96-3.98 9.96-8.88C21.96 6.02 17.5 2.04 12 2.04Zm4.22 8.9-2.68-1.7c-.18-.12-.42-.08-.56.08l-2.23 2.58c-.12.14-.33.17-.49.07l-2.02-1.24c-.29-.18-.61.17-.41.45l1.79 2.43c.13.18.39.2.55.04l2.41-2.36c.13-.12.33-.14.48-.04l2.95 1.95c.3.2.62-.18.41-.46Z" />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#31A24C] ring-2 ring-[#006AFF]"></span>
                </div>
                <div className="leading-tight">
                  <div className="text-white font-semibold">Chat Bot</div>
                  <div className="text-white/80 text-xs">Trực tuyến</div>
                </div>
              </div>
              <button
                aria-label="Minimize chat"
                className="text-white/90 hover:text-white px-2 text-xl leading-none"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-[#F0F2F5]"
            >
              {messages.length === 0 && !loading && (
                <div className="text-gray-500 text-sm text-center mt-8">Hãy gửi câu hỏi cho bot!</div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={
                      `px-3 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm ` +
                      (msg.role === 'user'
                        ? 'bg-[#0084FF] text-white rounded-br-sm'
                        : 'bg-white text-[#050505] rounded-bl-sm')
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl text-sm max-w-[75%] bg-white text-[#050505] inline-flex items-center gap-2 shadow-sm rounded-bl-sm">
                    <span>Đang soạn…</span>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <form
              className="p-3 sm:p-4 border-t bg-white"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-[#F0F2F5] rounded-full px-3 py-2 border border-transparent focus-within:border-[#D0D7DE]
                                focus-within:ring-2 focus-within:ring-[#0084FF1A]">
                  <input
                    type="text"
                    className="w-full bg-transparent outline-none text-[15px] placeholder:text-gray-500 focus:ring-0 focus:outline-none "
                    placeholder="Aa"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    autoFocus
                    aria-label="Tin nhắn"
                  />
                </div>
                {input.trim().length === 0 ? (
                  <button
                    type="button"
                    onClick={() => handleSend('👋')}
                    className={`h-10 w-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center transition
                                ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    disabled={loading}
                    aria-label="Gửi lời chào"
                    title="Gửi lời chào"
                  >
                    <span className="text-lg select-none">👋</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md transition
                                ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-br from-[#00B2FF] to-[#006AFF] hover:brightness-110'}`}
                    disabled={loading}
                    aria-label="Gửi"
                  >
                    <SendIcon size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
