'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Play, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { purchaseTicket, watchPartyApi, type WatchParty } from '@/apis/watch-party.api';
import { useToast } from '@/hooks/useToast';
import { getAuthToken } from '@/utils/auth.util';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') {
    return 'Free';
  }

  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function WatchPartyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();

  const [party, setParty] = useState<WatchParty | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadParty();
    }
  }, [params.id]);

  const loadParty = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const data = await watchPartyApi.getById(params.id as string);
      setParty(data);
    } catch (err) {
      console.error('Failed to load watch party:', err);
      error('Unable to load watch party details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!party) return;
    const token = getAuthToken();

    if (!token) {
      error('Please sign in to purchase a ticket.');
      router.push(`/auth/login?from=${encodeURIComponent(`/watch-parties/${params.id}`)}`);
      return;
    }

    try {
      setPurchasing(true);
      await purchaseTicket(party.id, party.ticket?.id);
      success('Ticket purchased successfully!');
      await loadParty();
      router.push(`/watch-parties/${party.id}/live`);
    } catch (err) {
      console.error('Failed to purchase ticket:', err);
      error('Failed to complete purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleJoinLive = () => {
    router.push(`/watch-parties/${params.id}/live`);
  };

  const ticketPrice = useMemo(() => {
    if (!party?.ticket) return formatCurrency(0);
    return formatCurrency(Number(party.ticket.price));
  }, [party?.ticket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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

  const startTime = new Date(party.start_time);
  const endTime = new Date(party.end_time);
  const isOngoing = party.status === 'ongoing';
  const isUpcoming = party.status === 'upcoming';

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={party.movie?.backdrops?.[0]?.url || party.movie?.posters?.[0]?.url || '/placeholder-movie.jpg'}
          alt={party.movie?.title ?? 'Watch party'}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />

        {party.is_featured && (
          <div className="absolute top-8 right-8 bg-[#e50914] text-white text-sm font-bold px-4 py-2 rounded-full">
            FEATURED EVENT
          </div>
        )}

        {isOngoing && (
          <div className="absolute top-8 left-8 flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-full animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            LIVE NOW
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold mb-4">{party.movie?.title}</h1>

          <div className="flex flex-wrap gap-6 mb-8 text-[#a0a0a0]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(startTime, 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>
                {party.participant_count} / {party.max_participants} participants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span>Ticket Price: {ticketPrice}</span>
            </div>
          </div>

          <p className="text-lg text-[#a0a0a0] mb-8 leading-relaxed">{party.movie?.overview}</p>

          <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-3">Access Ticket</h2>
            <p className="text-[#a0a0a0] mb-4">
              Purchase a ticket to unlock the live watch party room and real-time chat experience.
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-3xl font-bold text-white">{ticketPrice}</span>

              {party.has_purchased ? (
                <button
                  onClick={handleJoinLive}
                  className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b8070f] text-white font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Join Watch Party
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || party.status === 'finished'}
                  className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-3 rounded-lg transition-colors disabled:bg-[#333333] disabled:text-[#666666] disabled:cursor-not-allowed"
                >
                  {purchasing ? 'Processing...' : 'Buy Ticket'}
                </button>
              )}
            </div>
          </div>

          {party.participants && party.participants.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333333]">
              <h3 className="text-xl font-bold mb-4">Participants</h3>
              <div className="flex flex-wrap gap-3">
                {party.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 bg-[#0b0b0b] px-4 py-2 rounded-full border border-[#333333]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center text-white text-sm font-bold">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{participant.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
