export default function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-xs">
      {/* Top row: Badge & Rating skeleton */}
      <div className="flex h-6 items-center justify-between">
        <div className="skeleton-shimmer h-5 w-16 rounded-md bg-neutral-200" />
        <div className="skeleton-shimmer h-4 w-10 rounded bg-neutral-200" />
      </div>

      {/* Product Image skeleton */}
      <div className="skeleton-shimmer my-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-neutral-100 p-2">
        <svg
          className="h-10 w-10 text-neutral-300"
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

      {/* Product Details skeleton */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex min-h-[40px] flex-col gap-1.5">
          <div className="skeleton-shimmer h-3.5 w-4/5 rounded bg-neutral-200" />
          <div className="skeleton-shimmer h-3.5 w-3/5 rounded bg-neutral-200/80" />
        </div>

        {/* Pricing & Button skeleton */}
        <div className="flex items-end justify-between border-t border-neutral-100 pt-2">
          <div className="flex flex-col gap-1">
            <div className="skeleton-shimmer h-2.5 w-24 rounded bg-neutral-150" />
            <div className="skeleton-shimmer h-4 w-16 rounded bg-neutral-200" />
          </div>

          <div className="skeleton-shimmer h-9 w-9 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
