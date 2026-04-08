import { revalidatePath } from "next/cache";

/**
 * Invalidate store pages that depend on the product catalog (homepage slice,
 * shop grid, and the product detail page).
 */
export function revalidateProductPages(slug: string | null): void {
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) {
    revalidatePath(`/product/${slug}`);
  }
}
