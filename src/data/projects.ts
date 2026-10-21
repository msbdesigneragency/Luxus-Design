import { Locale } from "@/lib/i18n";
export type Project = {
  slug: string;
  titles: Record<Locale, string>;
  image: string;
  images: string[];
  category: "modernes" | "sur-mesure" | "chambres";
};
const p = (
  slug: string,
  fr: string,
  en: string,
  ar: string,
  image: string,
  category: Project["category"],
  images: string[] = [],
): Project => ({
  slug,
  titles: { fr, en, ar },
  image,
  category,
  images: [image, ...images],
});
export const projects: Project[] = [
  p(
    "salon-signature",
    "Salon signature sur mesure",
    "Signature bespoke living room",
    "صالون مميز حسب الطلب",
    "/images/hero-main.webp",
    "sur-mesure",
  ),
  p(
    "salon-harmonie",
    "Salon Harmonie",
    "Harmony living room",
    "صالون هارموني",
    "/images/project-2.webp",
    "sur-mesure",
  ),
  p(
    "salon-lignes-douces",
    "Salon aux lignes douces",
    "Soft lines living room",
    "صالون بخطوط ناعمة",
    "/images/project-6.webp",
    "modernes",
    ["/images/project-7.webp"],
  ),
  p(
    "salon-ecru",
    "Salon écru & matières naturelles",
    "Ecru & natural textures",
    "صالون بلون العاج وخامات طبيعية",
    "/images/project-1.webp",
    "modernes",
  ),
  p(
    "salon-modulaire",
    "Grand salon modulaire",
    "Modular living room",
    "صالون كبير متعدد الوحدات",
    "/images/project-4.webp",
    "sur-mesure",
  ),
  p(
    "salon-mineral",
    "Salon Minéral",
    "Mineral living room",
    "صالون مينيرال",
    "/images/project-5.webp",
    "modernes",
  ),
  p(
    "salon-ivoire",
    "Salon Ivoire",
    "Ivory living room",
    "صالون إيفوار",
    "/images/project-3.webp",
    "sur-mesure",
  ),
  p(
    "chambre-velours",
    "Chambre & tête de lit en velours",
    "Velvet bedroom",
    "غرفة نوم بلمسة مخملية",
    "/images/project-9.webp",
    "chambres",
    ["/images/project-10.webp"],
  ),
  p(
    "lit-coffre",
    "Lit coffre sur mesure",
    "Bespoke storage bed",
    "سرير تخزين حسب الطلب",
    "/images/project-11.webp",
    "chambres",
  ),
  p(
    "salon-bleu",
    "Salon bleu profond",
    "Deep blue living room",
    "صالون أزرق عميق",
    "/images/project-13.webp",
    "modernes",
  ),
  p(
    "salon-confort",
    "Salon Confort",
    "Comfort living room",
    "صالون كونفور",
    "/images/project-14.webp",
    "sur-mesure",
  ),
];
