"use client";
import { useMemo, useState } from 'react';
import { RecommendationSection } from '@/components/common';
import { isAuthenticated } from '@/utils/auth.util';
import { Flame, Sparkles, Target, Users } from 'lucide-react';

type RecType = 'content_based' | 'collaborative' | 'hybrid' | 'trending';

export default function RecommendationsPage() {
  const [recType, setRecType] = useState<RecType>('hybrid');
  const authed = isAuthenticated();

  const tabs = useMemo(
    () => [
      { key: 'hybrid' as RecType, label: 'Personalized', icon: Sparkles },
      { key: 'content_based' as RecType, label: 'Content-based', icon: Target },
      { key: 'collaborative' as RecType, label: 'Collaborative', icon: Users },
      { key: 'trending' as RecType, label: 'Trending', icon: Flame },
    ],
    []
  );

  const currentTitle = useMemo(() => {
    switch (recType) {
      case 'content_based':
        return 'Based on your taste';
      case 'collaborative':
        return 'People like you also watched';
      case 'trending':
        return 'Trending now';
      default:
        return 'Personalized for you';
    }
  }, [recType]);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[700px] rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-blue-600/20 blur-2xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Movie Recommendations
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-300">
              Discover movies tailored to your preferences. Sign in for personalized picks or browse what’s trending now.
            </p>

            {!authed && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700/70 bg-gray-800/50 px-3 py-2 text-sm text-gray-300">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>
                  You’re viewing public trends. <a href="/auth/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Sign in</a> for personalized recommendations.
                </span>
              </div>
            )}

            {/* Type Toggle */}
            <div className="mt-6 inline-flex rounded-xl bg-gray-800/60 p-1 ring-1 ring-gray-700/60 backdrop-blur">
              {tabs.map(({ key, label, icon: Icon }) => {
                const active = recType === key;
                return (
                  <button
                    key={key}
                    onClick={() => setRecType(key)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${active
                        ? 'bg-white text-gray-900'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
                      }`}
                    aria-pressed={active}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <RecommendationSection
          key={recType}
          type={recType}
          title={currentTitle}
          showRefresh
          className=""
        />
      </section>
    </div>
  );
}
