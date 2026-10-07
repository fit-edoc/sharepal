'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openCart } from '@/store/cartSlice';

export default function FloatingCartBar() {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount } = useAppSelector((state) => state.cart);

  // Only show when there are items in the cart
  if (totalQuantity === 0 || items.length === 0) {
    return null;
  }

  // Display up to 3 product images
  const displayedItems = items.slice(0, 3);
  const remainingCount = items.length - 3;

  return (
    <div className="fixed bottom-16 left-3 right-3 z-40 block sm:bottom-18 sm:left-6 sm:right-6">
      <div
        onClick={() => dispatch(openCart())}
        className="mx-auto flex max-w-md cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1633]/95 p-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-[#0d1633] active:scale-[0.99]"
        role="button"
        tabIndex={0}
        aria-label={`View cart with ${totalQuantity} items`}
      >
        {/* Left Side: Row of product images and +N badge if 4+ items */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center -space-x-2.5">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#0d1633] bg-white p-0.5 shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}

            {/* If 4 or more products added, show the extra div with the number count */}
            {remainingCount > 0 && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#0d1633] bg-[#9EFF00] text-xs font-black text-neutral-900 shadow-md">
                +{remainingCount}
              </div>
            )}
          </div>

          {/* Item count & pricing text */}
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-white leading-tight">
              {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-[11px] font-semibold text-[#9EFF00]">
              ₹ {totalAmount} <span className="text-neutral-400">/day</span>
            </span>
          </div>
        </div>

        {/* Right Side: View Cart / Checkout Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openCart());
          }}
          className="flex items-center gap-1.5 rounded-full bg-[#9EFF00] px-3.5 py-2 text-xs font-extrabold text-neutral-900 shadow-md transition-all hover:bg-[#8ee600] active:scale-95"
        >
          <span>View Cart</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
