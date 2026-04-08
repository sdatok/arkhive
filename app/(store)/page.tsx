import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/store/ProductGrid";
import SlicedPreview from "@/components/store/SlicedPreview";
import Reviews from "@/components/store/Reviews";
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
      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-5">
            New Season
          </p>
          <h1 className="text-[52px] md:text-[96px] font-black uppercase tracking-[-0.03em] leading-none mb-6">
            ARKHIVE
          </h1>
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] mb-10">
            Buy · Sell · Trade
          </p>
          <Link
            href="/shop"
            className="inline-block border border-black px-10 py-3 text-[11px] uppercase tracking-widest font-medium hover:bg-black hover:text-white transition-colors duration-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Sliced product preview */}
      {featured.length > 0 && <SlicedPreview products={featured} />}

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

      {/* Brand strip */}
      <section className="border-t border-neutral-200 mt-16">
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              "Arc'teryx",
              "Stone Island",
              "Supreme",
              "Off-White",
              "Stüssy",
              "Fear of God",
              "Loro Piana",
            ].map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="text-[11px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
