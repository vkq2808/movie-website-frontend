'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import type { WatchParty } from '@/apis/watch-party.api';

interface WatchPartyCardProps {
  party: WatchParty;
  index: number;
}

const formatPrice = (price?: number): string => {
  if (typeof price !== 'number') {
    return 'Free';
  }

  return new Intl.NumberFormat('vi-VN').format(price);
};

export function WatchPartyCard({ party, index }: WatchPartyCardProps) {
  const startTime = new Date(party.start_time);
  const isOngoing = party.status === 'ongoing';
  const isUpcoming = party.status === 'upcoming';
  const hasTicket = !!party.ticket;
  const formattedPrice = hasTicket ? formatPrice(Number(party.ticket?.price)) : 'Free';

  const actionLabel = party.has_purchased
    ? isOngoing
      ? 'Join Live'
      : 'View Details'
    : 'Buy Ticket';

  const actionHref = party.has_purchased
    ? isOngoing
      ? `/watch-parties/${party.id}/live`
      : `/watch-parties/${party.id}`
    : `/watch-parties/${party.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-[#1a1a1a] border border-[#333333] hover:border-[#e50914]/80 transition-all duration-300"
    >
      {party.is_featured && (
        <div className="absolute top-3 right-3 z-10 bg-[#e50914] text-white text-xs font-bold px-3 py-1 rounded-full">
          FEATURED
        </div>
      )}

      <Link href={`/watch-parties/${party.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={party.movie?.posters?.[0]?.url || '/placeholder-movie.jpg'}
            alt={party.movie?.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {isOngoing && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              LIVE NOW
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-4">
        <div>
          <Link href={`/watch-parties/${party.id}`}>
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-[#e50914] transition-colors">
              {party.movie?.title}
            </h3>
          </Link>

          <div className="space-y-2 text-sm text-[#a0a0a0]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(startTime, 'MMM dd, yyyy')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{format(startTime, 'HH:mm')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {party.participant_count} / {party.max_participants} joined
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>
                Ticket Price:{' '}
                <span className="text-white font-semibold">
                  {hasTicket ? `₫${formattedPrice}` : 'Free'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <Link
          href={actionHref}
          className={`w-full text-center font-bold py-2 px-4 rounded transition-colors ${
            party.has_purchased
              ? 'bg-[#e50914] hover:bg-[#b8070f] text-white'
              : 'bg-white hover:bg-gray-200 text-black'
          }`}
        >
          {party.has_purchased && isUpcoming ? 'Ticket Purchased' : actionLabel}
        </Link>
      </div>
    </motion.div>
  );
}
