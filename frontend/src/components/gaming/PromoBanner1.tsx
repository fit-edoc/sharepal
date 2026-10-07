'use client';

import Image from 'next/image';

interface PromoBanner1Props {
  href?: string;
}

export default function PromoBanner1({ href = 'https://assets.sharepal.in/' }: PromoBanner1Props) {
  return (
    <a
      href={href}
      className="group my-6 block w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg md:my-8"
      aria-label="Become an Asset Partner"
    >
      {/* Mobile Image (< sm) */}
      <div className="block sm:hidden w-full">
        <Image
          src="/asset-partner-mobile.webp"
          alt="Become an Asset Partner. Earn Monthly."
          width={1920}
          height={427}
          priority
          sizes="100vw"
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ height: 'auto' }}
        />
      </div>

      {/* Desktop / Other Screens (>= sm) */}
      <div className="hidden sm:block w-full">
        <Image
          src="/asset-fund-banner.webp"
          alt="Become an Asset Partner. Earn Monthly."
          width={3756}
          height={836}
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ height: 'auto' }}
        />
      </div>
    </a>
  );
}

