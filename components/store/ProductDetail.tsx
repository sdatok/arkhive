"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const sortedImages = [...product.images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setSelectedImage((i) => Math.min(i + 1, sortedImages.length - 1));
      if (e.key === "ArrowLeft") setSelectedImage((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, sortedImages.length]);

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    const effectivePrice =
      product.sizePricing && selectedSize && product.sizePricing[selectedSize] != null
        ? Number(product.sizePricing[selectedSize])
        : product.price;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: effectivePrice,
      size: selectedSize,
      imageUrl: sortedImages[0]?.url ?? "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="flex flex-col gap-2 w-16">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div
            className="relative flex-1 aspect-[3/4] bg-neutral-100 cursor-zoom-in"
            onClick={() => sortedImages[selectedImage] && setLightboxOpen(true)}
          >
            {sortedImages[selectedImage] ? (
              <Image
                src={sortedImages[selectedImage].url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                <span className="text-[11px] uppercase tracking-widest text-neutral-400">
                  No Image
                </span>
              </div>
            )}

            {product.status === "SOLD" && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[12px] uppercase tracking-widest font-medium">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">
            {product.brand}
          </p>
          <h1 className="text-[20px] md:text-[24px] font-bold mt-1 leading-tight">
            {product.name}
          </h1>
          <p className="text-[18px] font-medium mt-3">
            {product.sizePricing && Object.keys(product.sizePricing).length > 0 ? (
              selectedSize && product.sizePricing[selectedSize] != null ? (
                `$${Number(product.sizePricing[selectedSize]).toFixed(2)}`
              ) : (
                `From $${Math.min(...Object.values(product.sizePricing).map(Number)).toFixed(2)}`
              )
            ) : (
              `$${Number(product.price).toFixed(2)}`
            )}
          </p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-widest font-medium">
                  Select Size
                </p>
                {sizeError && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest">
                    Please select a size
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`px-4 py-2.5 text-[11px] uppercase tracking-widest border transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-neutral-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.status === "SOLD"}
            className={`mt-6 w-full py-4 text-[11px] uppercase tracking-widest font-medium transition-colors ${
              product.status === "SOLD"
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : added
                ? "bg-neutral-800 text-white"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            {product.status === "SOLD"
              ? "Sold Out"
              : added
              ? "Added to Cart"
              : "Add to Cart"}
          </button>

          {/* Description */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-[11px] uppercase tracking-widest font-medium mb-3">
              Details
            </p>
            <p className="text-[13px] leading-relaxed text-neutral-600">
              {product.description}
            </p>
          </div>

          {/* Category */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest">
              Category:{" "}
              <span className="text-black">{product.category}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && sortedImages[selectedImage] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-6 text-white text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            onClick={() => setLightboxOpen(false)}
          >
            Close
          </button>

          {/* Prev */}
          {selectedImage > 0 && (
            <button
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-[20px] opacity-50 hover:opacity-100 transition-opacity px-4 py-2"
              onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => i - 1); }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sortedImages[selectedImage].url}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next */}
          {selectedImage < sortedImages.length - 1 && (
            <button
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-[20px] opacity-50 hover:opacity-100 transition-opacity px-4 py-2"
              onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => i + 1); }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          {sortedImages.length > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest">
              {selectedImage + 1} / {sortedImages.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
