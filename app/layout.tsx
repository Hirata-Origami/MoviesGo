import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoviesGo - Stream Movies & TV Shows",
  description: "Watch unlimited movies and TV shows with MoviesGo. Stream the latest releases and timeless classics.",
  icons: {
    icon: [
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/logo.svg", sizes: "48x48", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "MoviesGo - Stream Movies & TV Shows",
    description: "Watch unlimited movies and TV shows with MoviesGo. Stream the latest releases and timeless classics.",
    images: [
      {
        url: "/logo.svg",
        width: 48,
        height: 48,
        alt: "MoviesGo Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoviesGo - Stream Movies & TV Shows",
    description: "Watch unlimited movies and TV shows with MoviesGo. Stream the latest releases and timeless classics.",
    images: ["/logo.svg"],
  },
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>{children}</body>
    </html>
  );
}
