'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openCart } from '@/store/cartSlice';

export default function BottomNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  const handleCategoryClick = () => {
    // Smooth scroll to category section if present, or top
    const elem = document.getElementById('categories') || document.querySelector('section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    // Focus search input if available, or scroll up
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-neutral-200/80 bg-white/95 px-3 py-2 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
            pathname === '/' ? 'text-[#4C187C]' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[11px] font-semibold leading-none">Home</span>
        </Link>

        {/* 2. Category */}
        <button
          onClick={handleCategoryClick}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-500 transition-colors hover:text-[#4C187C]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span className="text-[11px] font-semibold leading-none">Category</span>
        </button>

        {/* 3. Search */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center gap-1 py-1 text-neutral-500 transition-colors hover:text-[#4C187C]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[11px] font-semibold leading-none">Search</span>
        </button>

        {/* 4. Cart */}
        <button
          onClick={() => dispatch(openCart())}
          className="relative flex flex-col items-center justify-center gap-1 py-1 text-neutral-500 transition-colors hover:text-[#4C187C]"
        >
          <div className="relative">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9EFF00] px-1 text-[10px] font-extrabold text-neutral-900 shadow-xs">
                {totalQuantity}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold leading-none">Cart</span>
        </button>
      </div>
    </nav>
  );
}
