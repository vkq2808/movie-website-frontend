"use client";

import { useState, useEffect } from "react";
import { WatchPartyCard } from "./WatchPartyCard";
import { watchPartyApi, type WatchParty } from "@/apis/watch-party.api";
import { getAuthToken } from "@/utils/auth.util";

export function WatchPartyList() {
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "ongoing" | "finished"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParties();
  }, [filter]);

  const loadParties = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const data = await watchPartyApi.getAll(
        filter === "all" ? undefined : filter
      );
      setParties(data);
    } catch (error) {
      console.error("Failed to load watch parties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Buổi xem phim</h1>
          <p className="text-[#a0a0a0] mb-6">
            Tham gia các sự kiện phim được lên lịch và xem cùng với người khác
            theo thời gian thực
          </p>

          <div className="flex gap-3">
            {(["all", "upcoming", "ongoing", "finished"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    filter === status
                      ? "bg-[#e50914] text-white"
                      : "bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#333333]"
                  }`}
                >
                  {status === "all"
                    ? "Tất cả"
                    : status === "upcoming"
                    ? "Sắp tới"
                    : status === "ongoing"
                    ? "Đang diễn ra"
                    : "Đã kết thúc"}
                </button>
              )
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-[2/3] bg-[#333333]" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-[#333333] rounded" />
                  <div className="h-4 bg-[#333333] rounded w-3/4" />
                  <div className="h-4 bg-[#333333] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : parties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#a0a0a0] text-lg">
              Không tìm thấy buổi xem phim nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {parties.map((party, index) => (
              <WatchPartyCard key={party.id} party={party} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
