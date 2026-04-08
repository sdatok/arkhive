# Silk Archive

Designer · Luxury · Streetwear — a clean, Supreme-inspired e-commerce store.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Prisma · Neon Postgres · Vercel Blob  
**Monthly cost:** $0 to start (Vercel Hobby + Neon free tier + Vercel Blob free tier)

---

## Local Development

### 1. Copy env file and fill in values

```bash
cp .env.example .env
```

Required env vars:
| Variable | Source |
|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) → your project → Connection string |
| `DIRECT_URL` | Same as `DATABASE_URL` (used by Prisma migrations) |
| `BLOB_READ_WRITE_TOKEN` | Vercel dashboard → Storage → Blob → your store → Tokens |
| `BLOB_PUT_ACCESS` | **`private`** if the store is **Private** (required for uploads to succeed). Use **`public`** or omit only if the store is **Public**. |
| `ADMIN_PASSWORD` | Any password you choose |
| `SESSION_SECRET` | Run: `openssl rand -base64 32` |

### 2. Push database schema

```bash
npm run db:push
```

### 3. Run dev server

```bash
npm run dev
```

- Store: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → import repo
3. Add env vars in Vercel dashboard (same 5 variables from `.env.example`)
4. Deploy — Vercel auto-builds on every push

**Vercel Blob setup:**
- Vercel dashboard → Storage → Create Database → Blob
- Copy the `BLOB_READ_WRITE_TOKEN` into your env vars

**Neon Postgres setup:**
- [neon.tech](https://neon.tech) → New Project (free tier)
- Copy the connection string as `DATABASE_URL` and `DIRECT_URL`
- After first deploy, run `npm run db:push` locally pointing to your Neon DB

---

## Admin Panel

URL: `/admin`

Login with your `ADMIN_PASSWORD`. From there you can:
- Add products (name, brand, price, category, sizes, images, description)
- Toggle status: **Draft** → **Active** → **Sold**
- Edit or delete existing products

---

## StockX Scraper

A local-only utility to seed your store with product data from StockX.

**Setup (first time):**
```bash
npx playwright install chromium
```

**Usage:**
```bash
npm run scrape -- \
  --url "https://stockx.com/arcteryx-bird-head-toque-nightscape" \
  --slug "arcteryx-bird-head-toque" \
  --price 85 \
  --sizes "S/M,L/XL" \
  --category "Headwear"
```

This will:
1. Scrape product name, brand, and images from StockX
2. Upload images to Vercel Blob
3. Create a **Draft** product in your database
4. Print the admin URL to set price and publish

> **Note:** The scraper is a local dev tool only. Replace scraped images with your own photos over time.

---

## Adding Stripe (future)

When ready to accept payments:

```bash
npm install stripe @stripe/stripe-js
```

Add to `.env`:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

The checkout button in `CartDrawer.tsx` is already stubbed — replace the disabled button with a Stripe Checkout Session redirect.

---

## Project Structure

```
app/
  (store)/          # Public storefront (/, /shop, /product/[slug])
  admin/            # Password-protected admin panel
  api/              # API routes (products CRUD, auth, upload)
components/
  store/            # ProductCard, ProductGrid, Header, CartDrawer, etc.
  admin/            # ProductForm, ImageUploader, AdminProductTable
context/
  CartContext.tsx   # localStorage cart state
lib/
  db.ts             # Prisma client
  auth.ts           # JWT session helpers
  blob.ts           # Vercel Blob upload helpers
prisma/
  schema.prisma     # Product, ProductImage, Order schema
proxy.ts            # Admin route protection (Next.js 16 Proxy)
scripts/
  scrape-stockx.ts  # Local StockX scraper utility
```
