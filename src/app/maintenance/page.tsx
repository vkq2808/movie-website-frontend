'use client';
import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center max-w-lg p-8">
        <h1 className="text-3xl font-bold mb-4">We’ll be back soon</h1>
        <p className="text-gray-300 mb-6">
          Our site is currently undergoing scheduled maintenance. Thank you for your patience.
        </p>
        <p className="text-gray-500 text-sm">If you’re an administrator, you can continue to access the admin area.</p>
      </div>
    </div>
  );
}
