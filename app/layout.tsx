import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKHIVE",
  description: "Designer, Luxury & Streetwear",
  openGraph: {
    title: "ARKHIVE",
    description: "Designer, Luxury & Streetwear",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
