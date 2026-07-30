import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchDrawer from "@/components/search/SearchDrawer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAVERA | Fine & Anti-Tarnish Luxury Jewellery",
  description: "Discover handcrafted luxury jewellery, anti-tarnish everyday pieces, Korean hair accessories, and fine gold designs.",
  keywords: ["jewellery", "anti-tarnish jewellery", "korean jewellery", "earrings", "necklaces", "luxury gifts"],
  openGraph: {
    title: "SAVERA | Fine & Anti-Tarnish Luxury Jewellery",
    description: "Handcrafted luxury jewellery built for elegance and everyday brilliance.",
    siteName: "SAVERA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className={`${playfair.variable} ${lato.variable} antialiased selection:bg-[var(--color-primary-peach)] selection:text-[var(--color-text-main)]`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <SearchDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
