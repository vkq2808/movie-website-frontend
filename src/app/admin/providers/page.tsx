"use client";
import { useEffect, useState } from 'react';
import { watchProviderApi, WatchProvider } from '@/apis/watch-provider.api';
import { Tv } from 'lucide-react';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await watchProviderApi.getAllProviders();
    if (res.success && res.data) setProviders(res.data);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const onInit = async () => {
    setMessage(null);
    const res = await watchProviderApi.initializeProviders();
    if (res.success && res.data) setMessage(`Initialized ${res.data.count} providers`);
    await load();
  };

  if (loading) return <div className="p-6">Loading providers...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Tv className="h-8 w-8 text-blue-400" /> Watch Providers
              </h1>
              <p className="mt-3 text-base md:text-lg text-gray-300">Manage available streaming providers.</p>
            </div>
            <button onClick={onInit} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Initialize Defaults</button>
          </div>
          {message && <div className="mt-3 text-emerald-400">{message}</div>}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {providers.map(p => (
            <li key={p.id} className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-4">
              <div className="text-white font-medium">{p.name}</div>
              <div className="text-xs text-gray-400 mt-1">{p.slug}</div>
            </li>
          ))}
          {providers.length === 0 && <li className="text-sm text-gray-400">No providers</li>}
        </ul>
      </section>
    </div>
  );
}
