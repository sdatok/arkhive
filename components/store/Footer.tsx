"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWtfTheme } from "@/context/WtfThemeContext";

export default function Footer() {
  const pathname = usePathname();
  const { wtfSurfaceDark } = useWtfTheme();
  const dark = pathname === "/whats-the-fit" && wtfSurfaceDark;

  const link = dark
    ? "text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
    : "text-[11px] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors";

  return (
    <footer
      className={
        dark
          ? "border-t border-neutral-800 bg-black mt-20 transition-colors duration-500"
          : "border-t border-neutral-200 mt-20 transition-colors duration-500"
      }
    >
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p
            className={
              dark
                ? "text-[11px] uppercase tracking-widest font-bold text-white"
                : "text-[11px] uppercase tracking-widest font-bold"
            }
          >
            ARKHIVE
          </p>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Shop", href: "/shop" },
              { label: "Sell", href: "/sell" },
              { label: "Contact", href: "mailto:contact@arkhive.com" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={link}>
                {item.label}
              </Link>
            ))}
          </nav>

          <p
            className={
              dark
                ? "text-[11px] text-neutral-500"
                : "text-[11px] text-neutral-400"
            }
          >
            © {new Date().getFullYear()} ARKHIVE
          </p>
        </div>
      </div>
    </footer>
  );
}
