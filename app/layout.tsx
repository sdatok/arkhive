import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://arkhive.wtf";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ARKHIVE",
  description: "BUY - SELL - TRADE",
  openGraph: {
    title: "ARKHIVE",
    description: "BUY - SELL - TRADE",
    type: "website",
    url: siteUrl,
    siteName: "ARKHIVE",
    locale: "en_US",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "ARKHIVE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKHIVE",
    description: "BUY - SELL - TRADE",
    images: ["/og.jpeg"],
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
