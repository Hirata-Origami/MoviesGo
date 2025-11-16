import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoviesGo - Stream Movies & TV Shows",
  description: "Watch unlimited movies and TV shows with MoviesGo. Stream the latest releases and timeless classics.",
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
