"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type WtfThemeContextValue = {
  /** True after the WTF entrance animation finishes (header/footer invert). */
  wtfSurfaceDark: boolean;
  /** Call once when the black sweep completes. */
  completeWtfEntrance: () => void;
};

const WtfThemeContext = createContext<WtfThemeContextValue | null>(null);

export function WtfThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWtf = pathname === "/whats-the-fit";
  const [wtfSurfaceDark, setWtfSurfaceDark] = useState(false);

  useEffect(() => {
    if (!isWtf) {
      setWtfSurfaceDark(false);
    } else {
      setWtfSurfaceDark(false);
    }
  }, [isWtf, pathname]);

  const completeWtfEntrance = useCallback(() => {
    if (pathname === "/whats-the-fit") {
      setWtfSurfaceDark(true);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({ wtfSurfaceDark, completeWtfEntrance }),
    [wtfSurfaceDark, completeWtfEntrance]
  );

  return (
    <WtfThemeContext.Provider value={value}>{children}</WtfThemeContext.Provider>
  );
}

export function useWtfTheme(): WtfThemeContextValue {
  const ctx = useContext(WtfThemeContext);
  if (!ctx) {
    throw new Error("useWtfTheme must be used within WtfThemeProvider");
  }
  return ctx;
}
