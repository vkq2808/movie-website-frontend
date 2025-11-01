'use client';
import React, { useState } from 'react';
import { User } from '@/types/api.types';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { MovieCard } from '@/components/common';
import { Heart as HeartIcon, History as HistoryIcon, Wallet as WalletIcon, Settings as SettingsIcon } from 'lucide-react';

interface ProfileTabsProps {
  user: User;
}

export default function ProfileTabs({ user }: ProfileTabsProps) {
  const [selectedTab, setSelectedTab] = useState(0);

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
              {user.favoriteMovies && user.favoriteMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {user.favoriteMovies.map((movie) => (
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HistoryIcon size={48} className="text-slate-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">Watch history is empty</h3>
                <p className="text-slate-400 max-w-md">
                  Your watch history will appear here as you watch movies on our platform.
                </p>
              </div>
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
                <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
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
                      defaultValue={user.username}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
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
                      defaultValue={user.birthdate}
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
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-400">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                    Save Changes
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
