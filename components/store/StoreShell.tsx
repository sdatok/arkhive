"use client";

import { WtfThemeProvider, useWtfTheme } from "@/context/WtfThemeContext";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { usePathname } from "next/navigation";

function MainWithWtfBg({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { wtfSurfaceDark } = useWtfTheme();
  const isWtf = pathname === "/whats-the-fit";

  return (
    <main
      className={
        isWtf && wtfSurfaceDark
          ? "min-h-screen bg-black pt-11 transition-colors duration-500"
          : "pt-11"
      }
    >
      {children}
    </main>
  );
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <WtfThemeProvider>
      <Header />
      <MainWithWtfBg>{children}</MainWithWtfBg>
      <Footer />
    </WtfThemeProvider>
  );
}
