import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { generateMetadata as genMeta } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = genMeta({
  title: "Home",
  description: "A modern blog platform built with Next.js, Prisma, and MySQL",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
