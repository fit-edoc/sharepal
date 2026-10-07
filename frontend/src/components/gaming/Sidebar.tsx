'use client';

import { FaceSlightlySmiling } from "lucide-react";

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const SIDEBAR_ITEMS = [
  {
    id: 'all',
    label: 'All',
    icon: (
      <FaceSlightlySmiling />
    ),
  },
  {
    id: 'gta-vi',
    label: 'GTA VI',
    iconText: 'GTA VI',
    imgUrl: 'https://i.pinimg.com/736x/cb/ef/40/cbef4047fdebd665385a0becd046d454.jpg',
  },
  {
    id: 'ps5',
    label: 'PS5 Console',
    imgUrl: 'https://images.sharepal.in/categories/gaming-consoles/ps5/ps5-with-1-controller/ps5-console-with-1-controller-on-rent-sharepal-1.webp',
  },
  {
    id: 'xbox',
    label: 'Xbox Console',
    imgUrl: 'https://i.pinimg.com/736x/bb/97/09/bb97097896dc32cd40ce141aaee7a9df.jpg',
  },
  {
    id: 'vr',
    label: 'VR',
    imgUrl: 'https://i.pinimg.com/736x/ae/2d/85/ae2d85db7e4f6ef4c23f9f3169ac2c83.jpg',
  },
  {
    id: 'wheel',
    label: 'Racing Wheel',
    imgUrl: 'https://i.pinimg.com/736x/9d/23/14/9d23144a71b506f3794875f5af756672.jpg',
  },
  {
    id: 'big-screen',
    label: 'Big Screen',
    imgUrl:"/big.webp"
  },
];

export default function Sidebar({ activeCategory, onSelectCategory }: SidebarProps) {
  return (
    <aside className="relative z-20 flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white p-2 shadow-sm md:sticky md:top-[140px] md:p-3">
      <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar py-0.5 md:flex-col md:overflow-visible">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="group flex flex-col items-center justify-center gap-1 transition-all focus:outline-none"
            >
              <div
                className={`relative flex aspect-square w-12 items-center justify-center overflow-hidden rounded-xl border p-1 transition-all duration-200 group-hover:scale-105 md:w-14 lg:w-16 ${
                  isActive
                    ? 'border-[#4C187C] bg-purple-50 text-[#4C187C] shadow-sm ring-2 ring-[#4C187C]/20'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100'
                }`}
              >
                {item.imgUrl ? (
                  <img
                    src={item.imgUrl}
                    alt={item.label}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  item.icon
                )}
              </div>
              <span
                className={`max-w-[64px] text-center text-[11px] font-medium leading-tight md:text-xs ${
                  isActive ? 'font-bold text-[#4C187C]' : 'text-neutral-700'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="h-[2px] w-4 rounded-full bg-[#4C187C] transition-all md:w-6" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
