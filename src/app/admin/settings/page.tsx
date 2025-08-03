'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  ServerIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultLanguage: string;
  maxFileSize: number;
  sessionTimeout: number;
  enableAnalytics: boolean;
  backupFrequency: string;
  logRetentionDays: number;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsForm>({
    siteName: 'MovieStream',
    siteDescription: 'Your ultimate movie streaming destination',
    contactEmail: 'admin@moviestream.com',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
    defaultLanguage: 'en',
    maxFileSize: 10,
    sessionTimeout: 30,
    enableAnalytics: true,
    backupFrequency: 'daily',
    logRetentionDays: 30,
  });

  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System', icon: ServerIcon },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Saving settings:', settings);
      setSuccessMessage('Settings saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SettingsForm, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Site Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-300">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-300">
              Default Language
            </label>
            <select
              id="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Site Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-300">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">
                When enabled, only admins can access the site
              </p>
            </div>
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="registrationEnabled" className="text-sm font-medium text-gray-300">
                User Registration
              </label>
              <p className="text-sm text-gray-500">
                Allow new users to register accounts
              </p>
            </div>
            <input
              type="checkbox"
              id="registrationEnabled"
              checked={settings.registrationEnabled}
              onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Authentication & Security</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-300">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              id="sessionTimeout"
              min="5"
              max="480"
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
            <p className="mt-1 text-sm text-gray-500">
              Users will be automatically logged out after this period of inactivity
            </p>
          </div>

          <div>
            <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-300">
              Maximum File Upload Size (MB)
            </label>
            <input
              type="number"
              id="maxFileSize"
              min="1"
              max="100"
              value={settings.maxFileSize}
              onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-300">Security Recommendations</h4>
            <ul className="mt-2 text-sm text-yellow-200 space-y-1">
              <li>• Enable two-factor authentication for admin accounts</li>
              <li>• Regularly update passwords and review admin access</li>
              <li>• Monitor failed login attempts and suspicious activity</li>
              <li>• Keep session timeouts reasonably short for security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-300">
                Email Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive email notifications for important events
              </p>
            </div>
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-300">
                Push Notifications
              </label>
              <p className="text-sm text-gray-500">
                Receive browser push notifications
              </p>
            </div>
            <input
              type="checkbox"
              id="pushNotifications"
              checked={settings.pushNotifications}
              onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Event Types</h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-300">
            You will receive notifications for:
          </div>
          <ul className="text-sm text-gray-400 space-y-2 ml-4">
            <li>• New user registrations</li>
            <li>• Failed login attempts</li>
            <li>• System errors and warnings</li>
            <li>• Database backup completion</li>
            <li>• High resource usage alerts</li>
            <li>• Security incidents</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="enableAnalytics" className="text-sm font-medium text-gray-300">
                Enable Analytics
              </label>
              <p className="text-sm text-gray-500">
                Collect usage statistics and performance metrics
              </p>
            </div>
            <input
              type="checkbox"
              id="enableAnalytics"
              checked={settings.enableAnalytics}
              onChange={(e) => handleInputChange('enableAnalytics', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-300">
              Backup Frequency
            </label>
            <select
              id="backupFrequency"
              value={settings.backupFrequency}
              onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label htmlFor="logRetentionDays" className="block text-sm font-medium text-gray-300">
              Log Retention (days)
            </label>
            <input
              type="number"
              id="logRetentionDays"
              min="1"
              max="365"
              value={settings.logRetentionDays}
              onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
            />
            <p className="mt-1 text-sm text-gray-500">
              System logs older than this will be automatically deleted
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex">
          <ServerIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-300">System Status</h4>
            <div className="mt-2 text-sm text-blue-200 space-y-1">
              <div className="flex justify-between">
                <span>Database Status:</span>
                <span className="text-green-400">✓ Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Status:</span>
                <span className="text-green-400">✓ Running</span>
              </div>
              <div className="flex justify-between">
                <span>Last Backup:</span>
                <span>2024-01-15 02:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Used:</span>
                <span>2.3 GB / 10 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-900/50 border border-green-700 rounded-lg p-4">
              <div className="text-green-300 text-sm">{successMessage}</div>
            </div>
          )}

          <div className="bg-gray-800 shadow sm:rounded-lg">
            {/* Tabs */}
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>

            {/* Form Actions */}
            <div className="px-6 py-3 bg-gray-700 text-right border-t border-gray-600">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
