'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, decreaseQuantity } from '@/store/cartSlice';
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

  // Sync quantity with Redux cart state
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.id === product.id)
  );
  const quantity = cartItem?.quantity || 0;
  const isOutOfStock = product.out_of_stock;

  const handleIncrement = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isOutOfStock) return;

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

  return (
    <div
      onClick={(e) => {
        // If not out of stock and not yet added, clicking card adds 1 and expands counter
        if (!isOutOfStock && quantity === 0) {
          handleIncrement(e);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-3.5 sm:p-4 transition-all duration-300 ${
        isOutOfStock
          ? 'opacity-80 cursor-not-allowed border-neutral-100'
          : quantity > 0
          ? 'border-neutral-900/25 shadow-md ring-1 ring-neutral-900/10'
          : 'border-neutral-100 shadow-xs hover:border-neutral-250 hover:shadow-md cursor-pointer'
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
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[10px] sm:text-[11px] font-medium text-neutral-400">
              Select Dates to view price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-neutral-900 md:text-base">
                ₹ {product.per_day_rent}
              </span>
              <span className="text-[11px] text-neutral-500">/day</span>
            </div>
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
                aria-label={`Add ${product.name} to rental cart`}
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
