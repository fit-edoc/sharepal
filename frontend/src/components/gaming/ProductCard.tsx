'use client';

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
  const isOutOfStock = product.out_of_stock;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md ${
        isOutOfStock ? 'opacity-80' : ''
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

      {/* Product Image */}
      <div className="my-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-2 pt-1">
        <h3 className="line-clamp-2 min-h-[40px] text-xs font-bold leading-snug text-neutral-900 md:text-sm">
          {product.name}
        </h3>

        {/* Pricing & Add to Cart */}
        <div className="flex items-end justify-between border-t border-neutral-100 pt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-neutral-400">
              Select Dates to view price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-neutral-900 md:text-base">
                ₹ {product.per_day_rent}
              </span>
              <span className="text-[11px] text-neutral-500">/day</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed border-neutral-200 text-neutral-300'
                : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-95'
            }`}
            aria-label={`Add ${product.name} to rental cart`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
