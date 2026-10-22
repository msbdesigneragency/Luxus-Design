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
        </Suspense>
        {children}
        <a className="floating-whatsapp" href="https://wa.me/212666850179" target="_blank" rel="noopener noreferrer" aria-label={locale === "ar" ? "تواصل معنا عبر واتساب" : locale === "fr" ? "Nous contacter sur WhatsApp" : "Contact us on WhatsApp"}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.1 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.21-1.63a11.94 11.94 0 0 0 5.84 1.49h.01C18.65 23.86 24 18.5 24 11.91a11.86 11.86 0 0 0-3.48-8.43ZM12.06 21.85a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.9 9.9 0 0 1-1.51-5.31c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.02c0 5.47-4.45 9.89-9.99 9.89Zm5.45-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.21 3.09c.15.2 2.1 3.21 5.09 4.5.71.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" /></svg>
        </a>
      </body>
    </html>
  );
}
