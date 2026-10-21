import type { MetadataRoute } from "next";
import { locales, servicePaths } from "@/lib/i18n";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const paths = [
    "",
    "salons",
    "sur-mesure",
    "realisations",
    "a-propos",
    "contact",
    ...servicePaths.map((p) => "services/" + p),
    ...projects.map((p) => "realisations/" + p.slug),
  ];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${base}/${l}/${p}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((x) => [x, `${base}/${x}/${p}`]),
        ),
      },
    })),
  );
}
