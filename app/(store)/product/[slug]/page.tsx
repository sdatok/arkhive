import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetail from "@/components/store/ProductDetail";
import ProductGrid from "@/components/store/ProductGrid";
import type { Product } from "@/types";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { displayOrder: "asc" } } },
    });
    if (!product) return null;
    return {
      ...product,
      price: Number(product.price),
      sizePricing: product.sizePricing as Record<string, number> | null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

async function getRelated(
  category: string,
  excludeId: string
): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE", category, id: { not: excludeId } },
      include: { images: { orderBy: { displayOrder: "asc" } } },
      take: 4,
      orderBy: { createdAt: "desc" },
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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — ARKHIVE`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.category, product.id);

  return (
    <div>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="border-t border-neutral-200 mt-12">
          <div className="max-w-[1400px] mx-auto px-4 py-8">
            <h2 className="text-[11px] uppercase tracking-widest font-bold mb-6">
              You May Also Like
            </h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
