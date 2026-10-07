'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import CategoryTabs from '@/components/gaming/CategoryTabs';
import Sidebar from '@/components/gaming/Sidebar';
import HeroBanner from '@/components/gaming/HeroBanner';
import ProductCard, { Product } from '@/components/gaming/ProductCard';
import ProductCardSkeleton from '@/components/gaming/ProductCardSkeleton';
import PromoBanner1 from '@/components/gaming/PromoBanner1';
import PromoBanner2 from '@/components/gaming/PromoBanner2';
import FloatingDateBar from '@/components/gaming/FloatingDateBar';

export default function GamingGadgetsPage() {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch product data from public folder
  useEffect(() => {
    async function loadProducts() {
      try {
        const [res] = await Promise.all([
          fetch('/product-list.json'),
          new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          // Fallback to product.json
          const res2 = await fetch('/product.json');
          if (res2.ok) {
            const data2 = await res2.json();
            setProducts(data2.products || []);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products by selected sidebar category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;

    return products.filter((p) => {
      const name = p.name.toLowerCase();
      if (activeCategory === 'gta-vi') return name.includes('gta') || name.includes('fc2') || name.includes('fifa');
      if (activeCategory === 'ps5') return name.includes('ps5') || name.includes('playstation');
      if (activeCategory === 'xbox') return name.includes('xbox');
      if (activeCategory === 'vr') return name.includes('vr') || name.includes('oculus') || name.includes('quest') || name.includes('portal');
      if (activeCategory === 'wheel') return name.includes('wheel') || name.includes('racing') || name.includes('controller');
      if (activeCategory === 'big-screen') return name.includes('combo') || name.includes('all in one');
      return true;
    });
  }, [products, activeCategory]);

  // Split into chunks to interleave promotional banners
  const chunk1 = useMemo(() => filteredProducts.slice(0, 4), [filteredProducts]);
  const chunk2 = useMemo(() => filteredProducts.slice(4, 8), [filteredProducts]);
  const chunk3 = useMemo(() => filteredProducts.slice(8), [filteredProducts]);

  const handleAddToCart = (_item: Product) => {
    // Redux state sync is handled directly inside ProductCard
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
      {/* Category Navigation Bar (Sticky under Navbar) */}
      <div className="pt-[104px] md:pt-[112px] lg:pt-[78px]">
        <CategoryTabs />
      </div>

      {/* Main Content Layout with Left Sidebar + Right Products Grid */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
          {/* Left Category Sidebar */}
          <div className="w-full shrink-0 md:w-20 lg:w-24">
            <Sidebar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          {/* Right Main Product Feed */}
          <main className="min-w-0 flex-1">
            {/* Hero Gradient Banner */}
            <HeroBanner />

            {/* Product Section Header */}
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                Gaming Gadgets On Rent
              </h2>
              <span className="text-xs font-semibold text-neutral-500 sm:text-sm">
                Total items: <span className="text-neutral-800">{filteredProducts.length} items</span>
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, n) => (
                  <ProductCardSkeleton key={n} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
                <p className="text-base font-medium text-neutral-600">
                  No products found in this category.
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-3 text-sm font-semibold text-[#4C187C] underline hover:text-[#38115c]"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <>
                {/* ================= CHUNK 1 ================= */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {chunk1.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Banner 1: Asset Owner / Earn Monthly */}
                {chunk1.length > 0 && <PromoBanner1 />}

                {/* ================= CHUNK 2 ================= */}
                {chunk2.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {chunk2.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}

                {/* Banner 2: Rent Out Your Gear */}
                {chunk2.length > 0 && <PromoBanner2 />}

                {/* ================= CHUNK 3 ================= */}
                {chunk3.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {chunk3.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Floating Bottom Date Selector */}
      {/* <FloatingDateBar /> */}
    </div>
  );
}
