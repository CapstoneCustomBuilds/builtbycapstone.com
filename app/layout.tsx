import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import GSAPProvider from "@/components/providers/GSAPProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://builtbycapstone.com"),
  title: "Capstone Custom Builds — Tampa Bay's Premier Custom Builder",
  description:
    "Custom homes and renovations crafted with precision in the heart of Tampa Bay. Design-forward approach, transparent pricing, and hands-on leadership.",
  keywords: [
    "custom homes Tampa",
    "Tampa Bay builder",
    "custom construction Florida",
    "home renovations Tampa",
    "luxury homes Tampa Bay",
    "design-build Tampa",
  ],
  openGraph: {
    title: "Capstone Custom Builds — Tampa Bay's Premier Custom Builder",
    description:
      "Custom homes and renovations crafted with precision in the heart of Tampa Bay.",
    type: "website",
    url: "https://builtbycapstone.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <SmoothScrollProvider>
          <GSAPProvider>
            <LoadingScreen />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </GSAPProvider>
        </SmoothScrollProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
