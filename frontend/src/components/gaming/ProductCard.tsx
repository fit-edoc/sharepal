'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, decreaseQuantity } from '@/store/cartSlice';
import { openDateModal } from '@/store/rentalSlice';
export { default as ProductCardSkeleton } from './ProductCardSkeleton';

export interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  booked_count: number;
  tag: string;
  per_day_rent: number;
  out_of_stock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Rental state
  const { isDatesSelected, days } = useAppSelector((state) => state.rental);

  // Sync quantity with Redux cart state
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const quantity = cartItem?.quantity || 0;
  const isOutOfStock = product.out_of_stock;

  const handleCardClick = () => {
    if (isOutOfStock) return;
    // Clicking card opens custom calendar modal to select dates and view calculated price
    dispatch(
      openDateModal({
        id: product.id,
        name: product.name,
        image: product.image,
        per_day_rent: product.per_day_rent,
        tag: product.tag,
        rating: product.rating,
      })
    );
  };

  const handleIncrement = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isOutOfStock) return;

    // If dates are not chosen yet, open modal first to pick dates & see price
    if (!isDatesSelected) {
      dispatch(
        openDateModal({
          id: product.id,
          name: product.name,
          image: product.image,
          per_day_rent: product.per_day_rent,
          tag: product.tag,
          rating: product.rating,
        })
      );
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        per_day_rent: product.per_day_rent,
        tag: product.tag,
      })
    );

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleDecrement = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (quantity > 0) {
      dispatch(decreaseQuantity(product.id));
    }
  };

  const calculatedPrice = product.per_day_rent * (days || 1);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-3.5 sm:p-4 transition-all duration-300 ${
        isOutOfStock
          ? 'opacity-80 cursor-not-allowed border-neutral-100'
          : quantity > 0
          ? 'border-neutral-900/25 shadow-md ring-1 ring-neutral-900/10 cursor-pointer'
          : 'border-neutral-100 shadow-xs hover:border-purple-300 hover:shadow-md cursor-pointer'
      }`}
    >
      {/* Top row: Badge or Spacer */}
      <div className="flex h-6 items-center justify-between">
        {isOutOfStock ? (
          <span className="rounded-md border border-neutral-400 bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
            Out of Stock
          </span>
        ) : product.tag ? (
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              product.tag.toLowerCase().includes('trend')
                ? 'border border-amber-500 text-amber-600'
                : product.tag.toLowerCase().includes('new')
                ? 'border border-sky-500 text-sky-600'
                : 'border border-purple-500 text-purple-600'
            }`}
          >
            {product.tag}
          </span>
        ) : (
          <span />
        )}

        {product.rating > 0 && (
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
            <span className="text-amber-500">★</span>
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Image with Skeleton Loader */}
      <div className="relative my-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
        {!imageLoaded && (
          <div className="skeleton-shimmer absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-100">
            <svg
              className="h-8 w-8 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-contain transition-all duration-300 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 pt-1">
        <h3 className="line-clamp-2 min-h-[40px] text-xs font-bold leading-snug text-neutral-900 md:text-sm">
          {product.name}
        </h3>

        {/* Pricing & Add to Cart / Counter */}
        <div className="flex items-end justify-between border-t border-neutral-100 pt-2 gap-2">
          {/* Price display: Hidden with blur if dates not selected; shows calculated price if selected */}
          <div className="flex min-w-0 flex-1 flex-col">
            {isDatesSelected ? (
              <div>
                <span className="inline-block rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-[#4C187C] border border-purple-200/50">
                  {days} Days Rent
                </span>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-sm font-black text-neutral-900 md:text-base">
                    ₹ {calculatedPrice}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    (₹{product.per_day_rent}/d)
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col justify-center">
                <span className="truncate text-[10px] font-medium text-neutral-400">
                  Select dates to view price
                </span>
                <div className="relative mt-0.5 inline-flex items-center">
                  {/* Blurred price */}
                  <div className="flex select-none items-baseline gap-1 filter blur-[5px] opacity-35">
                    <span className="text-sm font-bold text-neutral-900 md:text-base">
                      ₹ 999
                    </span>
                    <span className="text-[11px] text-neutral-500">/day</span>
                  </div>
                  {/* Subtle clickable badge overlay */}
                  <div className="absolute inset-0 flex items-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-[#4C187C] border border-purple-200/70 shadow-2xs backdrop-blur-xs group-hover:bg-purple-100 group-hover:border-purple-300 transition-all">
                      <svg className="w-2.5 h-2.5 text-[#4C187C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                      </svg>
                      View Price
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Expands into Quantity Counter when added */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {quantity === 0 ? (
              <button
                onClick={handleIncrement}
                disabled={isOutOfStock}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ease-out active:scale-95 ${
                  isOutOfStock
                    ? 'cursor-not-allowed border-neutral-200 text-neutral-300'
                    : 'border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white shadow-xs'
                }`}
                aria-label={
                  isDatesSelected
                    ? `Add ${product.name} to rental cart`
                    : `Select rental dates for ${product.name}`
                }
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            ) : (
              <div
                className="flex h-9 w-24 sm:w-28 items-center justify-between rounded-full bg-neutral-900 px-1 text-white shadow-md transition-all duration-300 ease-out"
                role="group"
                aria-label={`Quantity counter for ${product.name}`}
              >
                {/* Decrement / Remove button */}
                <button
                  onClick={handleDecrement}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/20 active:scale-90"
                  aria-label="Decrease quantity"
                >
                  {quantity === 1 ? (
                    <svg className="h-3.5 w-3.5 text-red-400 hover:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14" />
                    </svg>
                  )}
                </button>

                {/* Current Quantity */}
                <span className="min-w-5 text-center text-xs sm:text-sm font-bold text-white tabular-nums select-none">
                  {quantity}
                </span>

                {/* Increment button */}
                <button
                  onClick={handleIncrement}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/20 active:scale-90"
                  aria-label="Increase quantity"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

