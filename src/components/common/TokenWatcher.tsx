"use client";
import React from "react";
import { useAuthStore } from "@/zustand/auth.store";

// Polling-based watcher for access_token cookie changes
// Triggers fetchUser whenever the token changes (login, refresh, logout)
export default function TokenWatcher() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const lastTokenRef = React.useRef<string | null>(null);
  const intervalMs = 15000; // 15s

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
    return null;
  };

  const checkAndFetch = React.useCallback(() => {
    try {
      const token = getCookie("access_token");
      if (!token) return;
      if (token !== lastTokenRef.current) {
        lastTokenRef.current = token;
        // Fetch user on any change (including token removal)
        fetchUser().catch(() => void 0);
      }
    } catch {
      // ignore
    }
  }, [fetchUser]);

  React.useEffect(() => {
    // Initial check
    checkAndFetch();

    // Interval polling
    const id = window.setInterval(checkAndFetch, intervalMs);

    // Revalidate on tab focus/visibility/online
    const onFocus = () => checkAndFetch();
    const onVisibility = () => document.visibilityState === "visible" && checkAndFetch();
    const onOnline = () => checkAndFetch();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);

    // Optional cross-tab updates via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("auth");
      channel.onmessage = (e) => {
        if (e?.data?.type === "token-updated") checkAndFetch();
      };
    } catch {
      // ignore if unsupported
    }

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
      try { if (channel) { channel.close(); } } catch { /* ignore */ }
    };
  }, [checkAndFetch]);

  return null;
}
