'use client';

import { useState } from 'react';

const CATEGORIES = [
  { id: 'photography', name: 'Photography', href: '/bangalore/photography-on-rent' },
  { id: 'gaming', name: 'Gaming', href: '/bangalore/gaming-gadgets-on-rent' },
  { id: 'outdoor', name: 'Outdoor', href: '/bangalore/outdoor-gears-on-rent' },
  { id: 'entertainment', name: 'Entertainment', href: '/bangalore/entertainment-on-rent' },
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState('gaming');

  return (
    <div className="sticky top-[104px] z-30 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-all md:top-[112px] lg:top-[78px]">
      <div className="mx-auto flex max-w-4xl items-center justify-start overflow-x-auto px-4 py-0.5 no-scrollbar sm:justify-center">
        <div className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-16">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative whitespace-nowrap py-3 text-xs font-semibold transition-colors duration-200 sm:text-sm md:text-base ${
                  isActive
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 mx-auto h-[3px] w-full rounded-full bg-[#4C187C]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
