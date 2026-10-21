import { NextRequest, NextResponse } from "next/server";
import { copy, locales, Locale, navPaths, servicePaths } from "@/lib/i18n";
import { projects } from "@/data/projects";
// Validate before streaming so unknown content returns an actual HTTP 404.
export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  if (!segments.length) return NextResponse.next();
  const [locale, ...path] = segments;
  const validLocale = locales.includes(locale as Locale);
  const valid =
    validLocale &&
    (path.length === 0 ||
      (path.length === 1 &&
        [
          ...navPaths,
          "services",
          "confidentialite",
          "mentions-legales",
        ].includes(path[0])) ||
      (path.length === 2 &&
        ((path[0] === "services" && servicePaths.includes(path[1])) ||
          (path[0] === "realisations" &&
            projects.some((p) => p.slug === path[1])))));
  if (valid) return NextResponse.next();
  const l = validLocale ? (locale as Locale) : "fr",
    t = copy[l];
  return new NextResponse(
    `<!doctype html><html lang="${l}" dir="${l === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t.notFound} | LUXUS DESIGN</title><style>body{margin:0;background:#faf9f7;color:#211b15;font-family:Arial,sans-serif;min-height:100svh;display:grid;place-items:center}main{padding:40px}p{letter-spacing:3px;font-size:12px}h1{font-size:clamp(32px,6vw,64px);font-weight:400}a{color:inherit;text-underline-offset:6px;display:inline-block;padding:15px 0}</style></head><body><main><p>LUXUS DESIGN · 404</p><h1>${t.notFound}</h1><a href="/${l}">${t.nav[0]} →</a></main></body></html>`,
    { status: 404, headers: { "Content-Type": "text/html;charset=utf-8" } },
  );
}
export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt|sitemap.xml).*)"],
};
