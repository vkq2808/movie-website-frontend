'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { WatchPartyTicket as Ticket } from '@/apis/watch-party.api';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (ticketId: string) => Promise<void>;
  tickets: Ticket[];
}

export function TicketPurchaseModal({
  isOpen,
  onClose,
  onPurchase,
  tickets,
}: TicketPurchaseModalProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    if (!selectedTicket) return;

    try {
      setPurchasing(true);
      await onPurchase(selectedTicket);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full mx-4 border border-[#333333]">
        <div className="flex items-center justify-between p-6 border-b border-[#333333]">
          <h2 className="text-2xl font-bold text-white">Select Your Ticket</h2>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTicket === ticket.id
                  ? 'border-[#e50914] bg-[#e50914]/10'
                  : 'border-[#333333] hover:border-[#555555]'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                    {ticket.is_voucher && (
                      <span className="bg-[#e50914] text-white text-xs font-bold px-2 py-1 rounded">
                        VOUCHER
                      </span>
                    )}
                  </div>
                  <p className="text-[#a0a0a0] text-sm mb-3">{ticket.description}</p>
                  <div className="text-2xl font-bold text-white">
                    ${ticket.price.toFixed(2)}
                  </div>
                </div>
                {selectedTicket === ticket.id && (
                  <div className="w-6 h-6 rounded-full bg-[#e50914] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-[#333333] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#333333] hover:bg-[#444444] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={!selectedTicket || purchasing}
            className="flex-1 bg-[#e50914] hover:bg-[#b8070f] disabled:bg-[#555555] disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {purchasing ? 'Processing...' : 'Purchase Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}