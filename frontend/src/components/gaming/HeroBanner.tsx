'use client';

import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="relative mb-6 w-full overflow-hidden rounded-2xl bg-[linear-gradient(360deg,rgb(138,43,226)_0%,rgb(76,24,124)_100%)] p-5 text-white shadow-md sm:p-8 md:mb-8 md:p-10">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

      {/* Left Image Div: Hidden on small screens, appears at left corner from sm breakpoint */}
      <div className="pointer-events-none absolute bottom-0 md:-bottom-5 lg:-bottom-15 left-0 hidden sm:block">
        <Image
          src="/gaming-left.webp"
          height={500}
          width={500}
          alt="gaming left"
          className="h-[140px] sm:h-[160px] md:h-[190px] lg:h-[255px] w-auto object-contain"
          style={{ width: 'auto' }}
        />
      </div>

      {/* Middle Content: Aligned left with justify-start on small screens, centered from sm breakpoint */}
      <div className="relative z-10 flex w-full max-w-[68%] flex-col items-start justify-start text-left sm:mx-auto sm:max-w-md sm:items-center sm:justify-center sm:text-center md:max-w-xl lg:max-w-2xl">
        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight drop-shadow-md sm:text-2xl md:text-3xl lg:text-4xl text-nowrap">
          Gaming Consoles
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-xs font-semibold text-purple-100 sm:text-sm md:text-base">
          Rent the latest gaming gadgets from <span className="font-bold italic text-[#9EFF00]">SharePal</span> — PS5, Xbox, Oculus VR, Racing Wheel on rent.
        </p>

        {/* Brand Badges */}
        <div className="mt-6 flex  items-center justify-start gap-3 sm:mt-5 sm:justify-center sm:gap-6">
          {/* Xbox */}
          <div className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100">
            <Image
              height={32}
              width={80}
              src="/xbox.svg"
              alt="xbox"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </div>

          {/* PS5 */}
          <div className="flex items-center gap-1.5 border-l-2 border-r-2 border-purple-600/50 px-2 opacity-90 transition-opacity hover:opacity-100 sm:border-l-4 sm:border-r-4 sm:px-3">
            <Image
              height={32}
              width={80}
              src="/ps5.svg"
              alt="ps5"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </div>

          {/* Sony */}
          <div className="flex items-center gap-1.5 opacity-90 transition-opacity hover:opacity-100">
            <Image
              height={32}
              width={80}
              src="/sony.svg"
              alt="sony"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain"
              style={{ width: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* Right Image Div: Placed at right corner, responsive height across screen sizes */}
      <div className="pointer-events-none absolute bottom-0 md:-bottom-5 lg:-bottom-15 right-0 block">
        <Image
          src="/gaming-right.webp"
          height={500}
          width={500}
          alt="gaming right"
          className="h-[120px] sm:h-[160px] md:h-[190px] lg:h-[255px] w-auto object-contain"
          style={{ width: 'auto' }}
        />
      </div>
    </div>
  );
}
