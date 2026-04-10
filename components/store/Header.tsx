"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWtfTheme } from "@/context/WtfThemeContext";
import CartDrawer from "./CartDrawer";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { wtfSurfaceDark } = useWtfTheme();
  const isWtf = pathname === "/whats-the-fit";
  const dark = isWtf && wtfSurfaceDark;

  const { itemCount, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const link = dark
    ? "text-white text-[11px] uppercase tracking-widest font-medium hover:text-neutral-400 transition-colors"
    : "text-black text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors";

  const logo = dark
    ? "text-white absolute left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.2em] font-black"
    : "text-black absolute left-1/2 -translate-x-1/2 text-[13px] uppercase tracking-[0.2em] font-black";

  const cartBtn = dark
    ? "text-[11px] uppercase tracking-widest font-medium text-white hover:text-neutral-400 transition-colors"
    : "text-[11px] uppercase tracking-widest font-medium hover:text-neutral-500 transition-colors";

  const menuToggle = dark
    ? "md:hidden text-[11px] uppercase tracking-widest font-medium text-white"
    : "md:hidden text-[11px] uppercase tracking-widest font-medium";

  return (
    <>
      <header
        className={
          dark
            ? "fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black transition-colors duration-500"
            : "fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 bg-white transition-colors duration-500"
        }
      >
        <div className="max-w-[1400px] mx-auto px-4 h-11 flex items-center justify-between">
          <button
            className={menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/shop" className={link}>
              Shop
            </Link>
            <Link href="/whats-the-fit" className={link}>
              WTF
            </Link>
            <Link href="/sell" className={link}>
              Sell
            </Link>
          </nav>

          <Link href="/" className={logo}>
            ARKHIVE
          </Link>

          <div className="flex items-center gap-6">
            <button onClick={toggleCart} className={cartBtn}>
              Cart
              {itemCount > 0 && (
                <span className="ml-1 text-[10px]">({itemCount})</span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className={
              dark
                ? "md:hidden border-t border-neutral-800 bg-black"
                : "md:hidden border-t border-neutral-200 bg-white"
            }
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              <Link
                href="/shop"
                className={
                  dark
                    ? "text-[11px] uppercase tracking-widest font-medium text-white"
                    : "text-[11px] uppercase tracking-widest font-medium"
                }
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/whats-the-fit"
                className={
                  dark
                    ? "text-[11px] uppercase tracking-widest font-medium text-white"
                    : "text-[11px] uppercase tracking-widest font-medium"
                }
                onClick={() => setMenuOpen(false)}
              >
                WTF
              </Link>
              <Link
                href="/sell"
                className={
                  dark
                    ? "text-[11px] uppercase tracking-widest font-medium text-white"
                    : "text-[11px] uppercase tracking-widest font-medium"
                }
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
