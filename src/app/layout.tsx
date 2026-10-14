import type { Metadata } from "next";
import { Inter } from "next/font/google";
import  Header  from "@/components/header";
import  { Footer }  from "@/components/footer";
import CartDrawer from "@/components/shop/CartDrawer";
import AkaChatWidget from "@/components/chat/AkaChatWidget";
import "./globals.css";
import { Suspense } from "react";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoleVault | Premium Footwear & Sneaker Drops",
  description: "Curated sneaker releases, limited edition drops, and exclusive access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100 antialiased flex flex-col justify-between selection:bg-neutral-800`}>
        <Suspense fallback={<div className="h-16 w-full bg-neutral-950 border-b border-neutral-800" />}>
          <Header />
        
        <main className="flex-grow">{children}</main>
        <CartDrawer />
        <AkaChatWidget />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}