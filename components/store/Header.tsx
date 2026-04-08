"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import { useState } from "react";

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-4 h-11 flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[11px] uppercase tracking-widest font-medium"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          {/* Nav left */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/shop"
              className="text-black text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/shop?category=New+Arrivals"
              className="text-black text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors"
            >
              New
            </Link>
            <Link
              href="/sell"
              className="text-black text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors"
            >
              Sell
            </Link>
          </nav>

          {/* Logo center */}
          <Link
            href="/"
            className="text-black absolute left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.2em] font-black"
          >
            ARKHIVE
          </Link>

          {/* Nav right */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleCart}
              className="text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="ml-1 text-[10px]">({itemCount})</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <nav className="flex flex-col px-4 py-4 gap-4">
              <Link
                href="/shop"
                className="text-[11px] uppercase tracking-widest font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop?category=New+Arrivals"
                className="text-[11px] uppercase tracking-widest font-medium"
                onClick={() => setMenuOpen(false)}
              >
                New
              </Link>
              <Link
                href="/sell"
                className="text-[11px] uppercase tracking-widest font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sell
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
