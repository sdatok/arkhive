import Link from "next/link";
import { KNOWN_BRANDS } from "@/lib/brands";

export default function BrandShowcase() {
  return (
    <section className="border-t border-neutral-200 py-14">
      <div className="max-w-[1400px] mx-auto px-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 text-center mb-8">
          Shop by Brand
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-5">
          {KNOWN_BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/shop?brand=${encodeURIComponent(brand)}`}
              className="text-[12px] uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors duration-150"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
