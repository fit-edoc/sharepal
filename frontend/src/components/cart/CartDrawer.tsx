'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeCart,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '@/store/cartSlice';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount, isCartOpen } = useAppSelector(
    (state) => state.cart
  );

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, dispatch]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={() => dispatch(closeCart())}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isCartOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Cart Modal / Drawer coming from the LEFT */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg ${
          isCartOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Rental Cart Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-neutral-900">Rental Cart</h2>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-[#4C187C]">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="text-xs font-semibold text-neutral-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => dispatch(closeCart())}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close cart"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 text-[#4C187C]">
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-neutral-800">Your rental cart is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Explore our top consoles, controllers, and VR headsets to start renting.
                </p>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="mt-2 rounded-full bg-[#4C187C] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#3d1264] active:scale-95"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-2 text-xs font-bold text-neutral-900 sm:text-sm">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-end justify-between pt-2">
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          ₹ {item.per_day_rent * item.quantity}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          ₹ {item.per_day_rent}/day × {item.quantity}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center rounded-full border border-neutral-200 bg-white shadow-xs">
                        <button
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-l-full transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart(item))}
                          className="flex h-7 w-7 items-center justify-center text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-r-full transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 bg-neutral-50/70 p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-neutral-500">
              <span>Rental duration estimated</span>
              <span className="font-semibold text-neutral-700">Per Day Pricing</span>
            </div>

            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-medium text-neutral-600">Total Rent</span>
                <p className="text-xs text-neutral-400">Taxes calculated at checkout</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-neutral-900 sm:text-2xl">
                  ₹ {totalAmount}
                </span>
                <span className="text-xs text-neutral-500"> /day</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                alert('Proceeding to checkout...');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#9EFF00] py-3.5 text-sm font-extrabold text-neutral-950 shadow-md transition-all duration-200 hover:bg-[#8ee600] hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
