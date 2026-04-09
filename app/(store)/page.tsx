import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/store/ProductGrid";
import SlicedPreview from "@/components/store/SlicedPreview";
import Reviews from "@/components/store/Reviews";
import StoreFaq from "@/components/store/StoreFaq";
import HeroSection from "@/components/store/HeroSection";
import BrandShowcase from "@/components/store/BrandShowcase";
import type { Product } from "@/types";

/** Fisher–Yates shuffle — new array, original order unchanged */
function shuffleArray<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { displayOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 16,
    });
    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      sizePricing: p.sizePricing as Record<string, number> | null,
      consignment: Boolean(p.consignment),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("[getFeaturedProducts]", err);
    return [];
  }
}

export default async function HomePage() {
  unstable_noStore();
  const featured = await getFeaturedProducts();
  const sliceProducts = shuffleArray(
    featured.filter((p) => p.images.length > 0)
  );

  return (
    <div>
      <HeroSection />

      {/* Sliced product preview — random order each visit; grid below stays newest-first */}
      {sliceProducts.length > 0 && <SlicedPreview products={sliceProducts} />}

      {/* Shop by Brand */}
      <BrandShowcase />

      {/* New Arrivals grid */}
      {featured.length > 0 && (
        <section className="mt-0">
          <div className="max-w-[1400px] mx-auto px-4 py-8 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-widest font-bold">
              New Arrivals
            </h2>
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={featured} columns={5} />
        </section>
      )}

      {featured.length === 0 && (
        <section className="py-32 text-center">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">
            New drops coming soon
          </p>
        </section>
      )}

      <StoreFaq />

      {/* Reviews */}
      <Reviews />
    </div>
  );
}
