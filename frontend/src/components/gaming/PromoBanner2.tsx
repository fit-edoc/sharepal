'use client';

export default function PromoBanner2() {
  return (
    <div className="relative my-8 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] p-6 text-white shadow-lg md:p-8">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-100 sm:text-sm">
            Got gear you <span className="underline decoration-[#9EFF00] decoration-2">don&apos;t use anymore</span>?
          </p>
          <h2 className="text-xl font-extrabold sm:text-2xl md:text-3xl">
            Rent Out Your Gear on SharePal
          </h2>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-full bg-[#9EFF00] px-6 py-3 text-sm font-extrabold text-neutral-900 shadow-md transition-all duration-200 hover:bg-[#8ee600] hover:scale-105 active:scale-95">
          <span>Earn With Us</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
