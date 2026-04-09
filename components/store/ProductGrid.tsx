import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({
  products,
  columns = 5,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  };

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-[12px] uppercase tracking-widest text-neutral-400">
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className={`grid ${gridCols[columns]} gap-px bg-neutral-200`}>
        {products.map((product) => (
          <div key={product.id} className="bg-white p-3 md:p-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
