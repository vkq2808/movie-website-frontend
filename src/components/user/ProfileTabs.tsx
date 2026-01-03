'use client';
import React, { useEffect, useState } from 'react';
import { User } from '@/types/api.types';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { MovieCard } from '@/components/common';
import { Heart as HeartIcon, History as HistoryIcon, Wallet as WalletIcon, Settings as SettingsIcon } from 'lucide-react';
import { useUpdateProfile, useFavoriteMovies, useWatchHistory } from '@/hooks';
import { useAuthStore } from '@/zustand';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ProfileTabsProps {
  user: User;
}

interface SettingsFormState {
  username: string;
  email: string;
  birthdate: string;
  currentPassword: string;
  newPassword: string;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { fetchUser } = useAuthStore();

  const [form, setForm] = useState<SettingsFormState>({
    username: user.username || '',
    email: user.email || '',
    birthdate: user.birthdate || '',
    currentPassword: '',
    newPassword: '',
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Use hooks
  const { updateProfile } = useUpdateProfile();
  const { favorites, loading: favoritesLoading } = useFavoriteMovies();
  const { watchHistory, loading: historyLoading, refetch: refetchHistory } = useWatchHistory();

  // Fetch watch history when tab changes to History
  useEffect(() => {
    if (selectedTab === 1) {
      refetchHistory();
    }
  }, [selectedTab]);

  const handleSaveSettings = async (): Promise<void> => {
    setIsSaving(true);
    try {
      let profileUpdated = false;

      // Handle profile update if there are changes
      if (form.username !== user.username || form.birthdate !== user.birthdate) {
        const profilePayload: { username?: string; birthdate?: string } = {};
        
        if (form.username !== user.username) {
          profilePayload.username = form.username;
        }
        if (form.birthdate !== user.birthdate) {
          profilePayload.birthdate = form.birthdate;
        }

        await updateProfile(profilePayload);
        profileUpdated = true;
      }

      // Handle password change if both fields are filled
      if (form.currentPassword && form.newPassword) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
          {
            current_password: form.currentPassword,
            new_password: form.newPassword,
          },
          {
            withCredentials: true,
          }
        );

        // Clear password fields after successful change
        setForm((s) => ({
          ...s,
          currentPassword: '',
          newPassword: '',
        }));

        toast.success('Password changed successfully');
      } else if (profileUpdated) {
        toast.success('Profile updated successfully');
      }

      // Refetch user data to update the UI
      await fetchUser();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save changes';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        <TabList className="flex space-x-2 p-1 bg-slate-900 rounded-xl mb-6">
          <Tab
            className={({ selected }) => `
              flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium 
              ${selected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              transition-all focus:outline-none
            `}
          >
            <HeartIcon size={18} />
            <span>Favorites</span>
          </Tab>
          <Tab
            className={({ selected }) => `
              flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium 
              ${selected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              transition-all focus:outline-none
            `}
          >
            <HistoryIcon size={18} />
            <span>Watch History</span>
          </Tab>
          <Tab
            className={({ selected }) => `
              flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium 
              ${selected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              transition-all focus:outline-none
            `}
          >
            <WalletIcon size={18} />
            <span>Payments</span>
          </Tab>
          <Tab
            className={({ selected }) => `
              flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium 
              ${selected ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              transition-all focus:outline-none
            `}
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Favorites Tab */}
          <TabPanel>
            <div className="bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Your Favorite Movies</h2>
              {favoritesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {favorites.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <HeartIcon size={48} className="text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-slate-400 max-w-md">
                    You haven&lsquo;t added any movies to your favorites yet. Browse movies and click the heart icon to add them to your favorites.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Watch History Tab */}
          <TabPanel>
            <div className="bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Your Watch History</h2>
              {historyLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : watchHistory && watchHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {watchHistory.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <HistoryIcon size={48} className="text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Watch history is empty</h3>
                  <p className="text-slate-400 max-w-md">
                    Your watch history will appear here as you watch movies on our platform.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Payments Tab */}
          <TabPanel>
            <div className="bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Methods & History</h2>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <WalletIcon size={48} className="text-slate-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                <p className="text-slate-400 max-w-md">
                  Add a payment method to unlock premium features and rent exclusive movies.
                </p>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    // TODO: open payment method modal or redirect to payment setup flow
                  }}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <div className="bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Username</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Birthdate</label>
                    <input
                      type="date"
                      value={form.birthdate}
                      onChange={(e) => setForm((s) => ({ ...s, birthdate: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-lg font-medium mb-4">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">Current Password</label>
                      <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) => setForm((s) => ({ ...s, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">New Password</label>
                      <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) => setForm((s) => ({ ...s, newPassword: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setForm({
                        username: user.username || '',
                        email: user.email || '',
                        birthdate: user.birthdate || '',
                        currentPassword: '',
                        newPassword: '',
                      });
                    }}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      handleSaveSettings();
                    }}
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-md transition-colors ${isSaving ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
