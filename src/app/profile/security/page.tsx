"use client";
import { useEffect, useState } from 'react';
import { userApi, SessionInfo } from '@/apis/user.api';
import { Shield, LogOut, KeyRound, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ current_password: '', new_password: '' });

  const load = async () => {
    try {
      const res = await userApi.getSessions();
      if (res.success) setSessions(res.data);
    } catch (e) {
      // ignore unauthorized
    }
  };

  useEffect(() => { load(); }, []);

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); setError(null);
    try {
      const res = await userApi.changePassword({ current_password: form.current_password, new_password: form.new_password });
      if (res.success) setMessage('Password updated');
      else setError(res.message || 'Failed to change password');
    } catch {
      setError('Failed to change password');
    }
  };

  const onLogoutAll = async () => {
    setMessage(null); setError(null);
    try {
      const res = await userApi.logoutAll();
      if (res.success) setMessage('Logged out from all devices');
      await load();
    } catch {
      setError('Failed to logout all');
    }
  };

  const onDeactivate = async () => {
    setMessage(null); setError(null);
    try {
      const res = await userApi.deactivateAccount('User requested deactivation');
      if (res.success) setMessage('Account deactivated');
    } catch {
      setError('Failed to deactivate account');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-emerald-600/20 blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Shield className="h-8 w-8 text-emerald-400" />
              Account Security
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-300">
              Manage sessions, update your password, and control account safety.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Active Sessions */}
        <div className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <LogOut className="h-5 w-5 text-gray-300" /> Active Sessions
            </h2>
            <button
              onClick={onLogoutAll}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
            >
              Logout All Devices
            </button>
          </div>
          <ul className="space-y-3">
            {sessions.map(s => (
              <li key={s.id} className="rounded-lg border border-gray-700/60 bg-gray-900/40 p-4 text-sm">
                <div className="flex flex-wrap gap-4 text-gray-300">
                  <span><span className="text-gray-400">Session:</span> {s.id}</span>
                  {s.device && <span><span className="text-gray-400">Device:</span> {s.device}</span>}
                  {s.ip && <span><span className="text-gray-400">IP:</span> {s.ip}</span>}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  <span>Created: {new Date(s.created_at).toLocaleString()}</span>
                  {s.last_active_at && <span className="ml-3">Last Active: {new Date(s.last_active_at).toLocaleString()}</span>}
                </div>
              </li>
            ))}
            {sessions.length === 0 && (
              <li className="text-sm text-gray-400">No active sessions.</li>
            )}
          </ul>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border border-gray-700/60 bg-gray-800/40 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-gray-300" /> Change Password
          </h2>
          <form onSubmit={onChangePassword} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Current password</label>
              <input
                className="border border-gray-700 bg-gray-900 text-white rounded-lg w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="password"
                placeholder="••••••••"
                value={form.current_password}
                onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">New password</label>
              <input
                className="border border-gray-700 bg-gray-900 text-white rounded-lg w-full p-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="password"
                placeholder="At least 8 characters"
                value={form.new_password}
                onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-800/60 bg-red-950/30 p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </h2>
          <p className="text-sm text-red-300 mb-3">Deactivating your account will prevent future sign-ins until reactivated.</p>
          <button onClick={onDeactivate} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium">
            Deactivate Account
          </button>
        </div>

        {/* Messages */}
        {message && <div className="text-emerald-400">{message}</div>}
        {error && <div className="text-red-400">{error}</div>}
      </section>
    </div>
  );
}
