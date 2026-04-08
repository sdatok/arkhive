import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/store/ProductGrid";
import SlicedPreview from "@/components/store/SlicedPreview";
import Reviews from "@/components/store/Reviews";
import HeroSection from "@/components/store/HeroSection";
import BrandShowcase from "@/components/store/BrandShowcase";
import type { Product } from "@/types";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { displayOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return products.map((p) => ({
      ...p,
      price: Number(p.price),
      sizePricing: p.sizePricing as Record<string, number> | null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <HeroSection />

      {/* Sliced product preview */}
      {featured.length > 0 && <SlicedPreview products={featured} />}

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
          <ProductGrid products={featured} columns={4} />
        </section>
      )}

      {featured.length === 0 && (
        <section className="py-32 text-center">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">
            New drops coming soon
          </p>
        </section>
      )}

      {/* Reviews */}
      <Reviews />
    </div>
  );
}
