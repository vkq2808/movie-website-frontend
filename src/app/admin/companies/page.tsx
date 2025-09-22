"use client";
import { useEffect, useState } from 'react';
import { productionCompanyApi, ProductionCompany } from '@/apis/production-company.api';
import { Building2 } from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<ProductionCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await productionCompanyApi.listCompanies({ page: 1, limit: 20 });
    if (res.success) setCompanies(res.data.companies || []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const onInit = async () => {
    setMessage(null);
    const res = await productionCompanyApi.initializeCompanies();
    if (res.success) setMessage(res.message ?? 'Initialized');
    await load();
  };

  if (loading) return <div className="p-6">Loading production companies...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Building2 className="h-8 w-8 text-purple-400" /> Production Companies
              </h1>
              <p className="mt-3 text-base md:text-lg text-gray-300">Manage production company data and initialization.</p>
            </div>
            <button onClick={onInit} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium">Initialize</button>
          </div>
          {message && <div className="mt-3 text-emerald-400">{message}</div>}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map(c => (
            <li key={c.id} className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-4">
              <div className="text-white font-medium truncate" title={c.name}>{c.name}</div>
              {c.origin_country && (
                <div className="text-xs text-gray-400 mt-1">
                  Country: <span className="inline-block rounded bg-gray-700 px-1.5 py-0.5 text-gray-200">{c.origin_country}</span>
                </div>
              )}
            </li>
          ))}
          {companies.length === 0 && <li className="text-sm text-gray-400">No companies</li>}
        </ul>
      </section>
    </div>
  );
}
