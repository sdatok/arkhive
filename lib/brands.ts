/** Canonical brand list — used in BrandShowcase and admin ProductForm */
export const KNOWN_BRANDS = [
  "Acne Studios",
  "Arc'teryx",
  "BAPE",
  "Balenciaga",
  "Burberry",
  "Carhartt WIP",
  "Comme des Garçons",
  "Dior",
  "Fear of God",
  "Gucci",
  "Hellstar",
  "Jordan Brand",
  "Kith",
  "Louis Vuitton",
  "Maison Margiela",
  "Nike",
  "Noah",
  "Off-White",
  "Palace",
  "Prada",
  "Rick Owens",
  "Stone Island",
  "Stüssy",
  "Supreme",
  "Vale Forever",
  "Versace",
  "Yeezy",
].sort((a, b) => a.localeCompare(b));

/** Brands shown in Shop by Brand: curated list plus any active inventory brands. */
export function brandsForShowcase(fromInventory: string[]): string[] {
  const set = new Set<string>([...KNOWN_BRANDS, ...fromInventory]);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
