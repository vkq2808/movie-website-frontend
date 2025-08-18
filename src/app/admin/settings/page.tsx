"use client";
import React from 'react';
import { adminApi, type SystemSettings } from '@/apis/admin.api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<SystemSettings | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await adminApi.getSettings();
        if (!mounted) return;
        if (res?.success && res.data) {
          setSettings(res.data);
        } else {
          setError(res?.message || 'Failed to load settings');
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load settings';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      const res = await adminApi.updateSettings(settings);
      if (res?.success) {
        setSettings(res.data);
      } else {
        setError(res?.message || 'Failed to save settings');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save settings';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="mt-1 text-sm text-gray-400">Manage site-wide configuration and operational flags.</p>
      </header>
      {loading && (
        <div className="flex h-40 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!loading && error && (
        <div className="rounded-md border border-red-700/60 bg-red-900/20 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {!loading && !error && settings && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <Section title="General">
            <LabeledInput
              label="Site Name"
              value={settings.siteName}
              onChange={v => handleChange('siteName', v)}
            />
            <LabeledInput
              label="Site Description"
              value={settings.siteDescription}
              onChange={v => handleChange('siteDescription', v)}
            />
            <LabeledInput
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={v => handleChange('contactEmail', v)}
            />
            <ToggleRow
              label="Maintenance Mode"
              checked={settings.maintenanceMode}
              onChange={v => handleChange('maintenanceMode', v)}
            />
            <ToggleRow
              label="Enable Registration"
              checked={settings.registrationEnabled}
              onChange={v => handleChange('registrationEnabled', v)}
            />
          </Section>

          <Section title="Notifications">
            <ToggleRow
              label="Email Notifications"
              checked={settings.emailNotifications}
              onChange={v => handleChange('emailNotifications', v)}
            />
            <ToggleRow
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={v => handleChange('pushNotifications', v)}
            />
          </Section>

          <Section title="Defaults">
            <LabeledInput
              label="Default Language"
              value={settings.defaultLanguage}
              onChange={v => handleChange('defaultLanguage', v)}
            />
            <NumberInput
              label="Max File Size (MB)"
              value={settings.maxFileSize}
              onChange={v => handleChange('maxFileSize', v)}
            />
            <NumberInput
              label="Session Timeout (minutes)"
              value={settings.sessionTimeout}
              onChange={v => handleChange('sessionTimeout', v)}
            />
          </Section>

          <Section title="Maintenance">
            <LabeledInput
              label="Backup Frequency"
              value={settings.backupFrequency}
              onChange={v => handleChange('backupFrequency', v)}
            />
            <NumberInput
              label="Log Retention Days"
              value={settings.logRetentionDays}
              onChange={v => handleChange('logRetentionDays', v)}
            />
          </Section>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-white shadow transition hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-700/70 bg-gray-900/60 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-gray-900/50 transition-colors">
      <h2 className="mb-3 text-lg font-semibold text-gray-100">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function LabeledInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <input
        type={type}
        className="rounded-md border border-gray-700 bg-gray-800/70 px-3 py-2 text-gray-100 placeholder-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <input
        type="number"
        className="rounded-md border border-gray-700 bg-gray-800/70 px-3 py-2 text-gray-100 placeholder-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-700 bg-gray-900/70 px-3 py-2">
      <span className="text-sm text-gray-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-blue-600' : 'bg-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-5 w-5 transform rounded-full bg-white transition',
            checked ? 'translate-x-5' : 'translate-x-1'
          ].join(' ')}
        />
      </button>
    </div>
  );
}
