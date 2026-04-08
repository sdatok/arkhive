"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

/** Matches homepage featured count — show every featured product with an image, up to this many. */
const MAX_SLICES = 16;

interface SlicedPreviewProps {
  products: Product[];
}

export default function SlicedPreview({ products }: SlicedPreviewProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const slices = products
    .filter((p) => p.images.length > 0)
    .slice(0, MAX_SLICES);

  // The max expanded slice width as % of the full container.
  // Image wrappers are fixed to this width so object-cover never rescales.
  const basePercent = 100 / slices.length;
  const expandedPercent = basePercent * 2.5; // matches the hover multiplier below

  if (slices.length === 0) return null;

  return (
    <section className="border-b border-neutral-200 overflow-hidden">
      <div
        className="flex h-[420px] md:h-[560px]"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {slices.map((product, idx) => {
          const img = product.images[0];
          const isHovered = hoveredIdx === idx;
          const isIdle = hoveredIdx === null;
          const isOther = hoveredIdx !== null && !isHovered;

          // Width: hovered slice gets ~2.5× the base, others shrink
          const hoveredPercent = basePercent * 2.5;
          const otherPercent =
            (100 - hoveredPercent) / (slices.length - 1);

          const width = isIdle
            ? `${basePercent}%`
            : isHovered
            ? `${hoveredPercent}%`
            : `${otherPercent}%`;

          // Clamp: cap at 1400px max-width so vw math matches the container
          const imgWrapperWidth = `min(${expandedPercent}vw, ${(1400 * expandedPercent) / 100}px)`;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="relative flex-shrink-0 overflow-hidden group cursor-pointer"
              style={{
                width,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              {/* Fixed-size image wrapper — width never changes so object-cover
                  never rescales. The slice container clips via overflow:hidden. */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
                style={{ width: imgWrapperWidth }}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </div>

              {/* Dark overlay — fades away on hover */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  isHovered ? "opacity-0" : "opacity-30"
                }`}
              />

              {/* Divider line between slices */}
              {idx < slices.length - 1 && (
                <div className="absolute top-0 right-0 bottom-0 w-px bg-white/30 z-10" />
              )}

              {/* Product info — slides up on hover */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 transition-all duration-300 ${
                  isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <div className="bg-white/95 backdrop-blur-sm p-3">
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 truncate">
                    {product.brand}
                  </p>
                  <p className="text-[12px] font-semibold leading-tight mt-0.5 truncate">
                    {product.name}
                  </p>
                  <p className="text-[12px] mt-1">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Slice index label — visible when idle */}
              <div
                className={`absolute top-4 left-0 right-0 flex justify-center transition-opacity duration-300 ${
                  isIdle ? "opacity-60" : "opacity-0"
                }`}
              >
                <span className="text-[9px] uppercase tracking-[0.2em] text-white font-medium">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Label below */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
          Hover to preview
        </p>
        <Link
          href="/shop"
          className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
