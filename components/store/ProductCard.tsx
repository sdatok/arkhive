import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** Smaller type + image hints for narrow grids (e.g. “You may also like”). */
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  const primaryImage = product.images.sort(
    (a, b) => a.displayOrder - b.displayOrder
  )[0];
  const secondaryImage = product.images.sort(
    (a, b) => a.displayOrder - b.displayOrder
  )[1];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
              sizes={
                compact
                  ? "(max-width: 640px) 40vw, 220px"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
              }
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={product.name}
                fill
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                sizes={
                  compact
                    ? "(max-width: 640px) 40vw, 220px"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                }
              />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-neutral-200" />
        )}

        {product.status === "SOLD" && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest font-medium">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info — visible on hover on desktop, always on mobile */}
      <div
        className={
          compact
            ? "mt-1.5"
            : "mt-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200"
        }
      >
        <p
          className={`uppercase tracking-widest text-neutral-400 ${
            compact ? "text-[9px]" : "text-[10px]"
          }`}
        >
          {product.brand}
        </p>
        <p
          className={`font-medium mt-0.5 leading-snug ${
            compact ? "text-[11px]" : "text-[12px]"
          }`}
        >
          {product.name}
        </p>
        <p className={`mt-0.5 ${compact ? "text-[11px]" : "text-[12px]"}`}>
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
