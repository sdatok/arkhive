"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

/** Most recent featured products shown in the slice strip (desktop + mobile). */
const MAX_SLICES = 10;

interface SlicedPreviewProps {
  products: Product[];
}

function useTouchPrimaryUi() {
  const [touchPrimary, setTouchPrimary] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouchPrimary(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touchPrimary;
}

export default function SlicedPreview({ products }: SlicedPreviewProps) {
  const touchPrimary = useTouchPrimaryUi();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchExpandedIdx, setTouchExpandedIdx] = useState<number | null>(null);

  const activeIdx = touchPrimary ? touchExpandedIdx : hoveredIdx;

  const slices = products
    .filter((p) => p.images.length > 0)
    .slice(0, MAX_SLICES);

  const basePercent = 100 / slices.length;
  /** Desktop hover: modest grow. Touch: larger expanded slice so title/price fit. */
  const expandMult = touchPrimary ? 4.25 : 2.5;
  const expandedPercent = basePercent * expandMult;

  if (slices.length === 0) return null;

  const touchHasExpanded = touchPrimary && touchExpandedIdx !== null;

  return (
    <section className="border-b border-neutral-200 overflow-hidden">
      <div
        className={`flex md:h-[560px] transition-[height] duration-500 ease-out ${
          touchHasExpanded ? "h-[480px]" : "h-[420px]"
        }`}
        onMouseLeave={() => {
          if (!touchPrimary) setHoveredIdx(null);
        }}
      >
        {slices.map((product, idx) => {
          const img = product.images[0];
          const isActive = activeIdx === idx;
          const isIdle = activeIdx === null;

          const hoveredPercent = basePercent * expandMult;
          const otherPercent =
            slices.length > 1
              ? (100 - hoveredPercent) / (slices.length - 1)
              : 100;

          const width =
            slices.length === 1
              ? "100%"
              : isIdle
                ? `${basePercent}%`
                : isActive
                  ? `${hoveredPercent}%`
                  : `${otherPercent}%`;

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
              onMouseEnter={() => {
                if (!touchPrimary) setHoveredIdx(idx);
              }}
              onClick={(e) => {
                if (touchPrimary && touchExpandedIdx !== idx) {
                  e.preventDefault();
                  setTouchExpandedIdx(idx);
                }
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
                style={{ width: imgWrapperWidth }}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  quality={92}
                  sizes="(max-width: 768px) 85vw, 45vw"
                  priority={idx < 4}
                />
              </div>

              {idx < slices.length - 1 && (
                <div className="absolute top-0 right-0 bottom-0 w-px bg-white/30 z-10" />
              )}

              <div
                className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 transition-all duration-300 ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <div
                  className={`bg-white/95 backdrop-blur-sm shadow-sm border border-neutral-200/80 ${
                    touchPrimary && isActive ? "p-3.5" : "p-3"
                  }`}
                >
                  <p
                    className={`uppercase tracking-widest text-neutral-400 truncate ${
                      touchPrimary && isActive
                        ? "text-[10px]"
                        : "text-[9px] md:text-[9px]"
                    }`}
                  >
                    {product.brand}
                  </p>
                  <p
                    className={`font-semibold leading-tight mt-0.5 line-clamp-2 ${
                      touchPrimary && isActive
                        ? "text-[13px]"
                        : "text-[12px]"
                    }`}
                  >
                    {product.name}
                  </p>
                  <p
                    className={`mt-1 font-medium ${
                      touchPrimary && isActive ? "text-[14px]" : "text-[12px]"
                    }`}
                  >
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div
                className={`absolute top-3 md:top-4 left-0 right-0 flex justify-center transition-opacity duration-300 ${
                  isIdle ? "opacity-90" : "opacity-0"
                }`}
              >
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium px-2 py-1 rounded-sm bg-black/35 text-white backdrop-blur-[2px]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">
          <span className="md:hidden">Tap to expand · tap again to open</span>
          <span className="hidden md:inline">Hover to preview</span>
        </p>
        <Link
          href="/shop"
          className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors shrink-0"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
