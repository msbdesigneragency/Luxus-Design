import type { Metadata } from "next";
import { Roboto, Noto_Sans_Arabic } from "next/font/google";
import { Suspense } from "react";
import { RouteTransitions } from "@/components/RouteTransitions";
import { Header } from "@/components/Interactive";
import { locales, type Locale } from "@/lib/i18n";

import "../globals.css";
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});
const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: { default: "LUXUS DESIGN", template: "%s | LUXUS DESIGN" },
  description: "Mobilier sur mesure & design d’intérieur au Maroc.",
};
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale = "fr" } = await params;
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} style={{ backgroundColor: "#211c16" }}>
      <body className={`${roboto.variable} ${arabic.variable}`}>
        <Suspense>
          <RouteTransitions />
          {locales.includes(locale as Locale) && <Header locale={locale as Locale} />}
          {children}
        </Suspense>
      </body>
    </html>
  );
}
