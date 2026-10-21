import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, Locale, locales, navPaths, servicePaths } from "@/lib/i18n";
import { projects } from "@/data/projects";
import { NavigationTransition } from "@/components/NavigationTransition";
import { about } from "@/data/about";
import { Footer, Home, ProjectCTA, CustomServices } from "@/components/Site";
import {
  Button,
  CategoryCollection,
  ImageGallery,
  ProjectCard,
  ProjectGallery,
  QuoteForm,
} from "@/components/Interactive";
type Props = { params: Promise<{ locale: string; path?: string[] }> };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const l = locale as Locale,
    t = copy[l],
    route = path[0] || "";
  const project = projects.find((p) => p.slug === path[1]);
  const title =
    project?.titles[l] ||
    (route === "confidentialite"
      ? t.privacy
      : route === "mentions-legales"
        ? t.legal
        : route === "services"
          ? t.services[servicePaths.indexOf(path[1])]
          : t.nav[navPaths.indexOf(route)]) ||
    t.custom.join(" ");
  const url = siteUrl ? `${siteUrl}/${locale}/${path.join("/")}` : undefined;
  return {
    title,
    description: t.intro,
    alternates: siteUrl
      ? {
          canonical: url,
          languages: Object.fromEntries(
            locales.map((x) => [x, `${siteUrl}/${x}/${path.join("/")}`]),
          ),
        }
      : undefined,
    openGraph: {
      title: `${title} | LUXUS DESIGN`,
      description: t.intro,
      images: [
        {
          url: siteUrl
            ? `${siteUrl}/images/hero-main.webp`
            : "/images/hero-main.webp",
          width: 1672,
          height: 940,
        },
      ],
      locale: l === "ar" ? "ar_MA" : l === "fr" ? "fr_MA" : "en_US",
    },
    robots:
      route === "mentions-legales" || route === "confidentialite"
        ? { index: false, follow: true }
        : undefined,
  };
}
export default async function Page({ params }: Props) {
  const { locale, path = [] } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale,
    t = copy[l],
    route = path[0] || "";
  let content;
  if (!path.length) content = <Home locale={l} />;
  else if (path.length === 1 && route === "salons")
    content = (
      <>
        <CategoryCollection locale={l} />
        <ProjectCTA locale={l} />
      </>
    );
  else if (path.length === 1 && route === "realisations")
    content = (
      <>
        <section className="section page-intro">
          <p className="eyebrow">LUXUS DESIGN · {t.nav[3]}</p>
          <h1>{t.latest}</h1>
          <p>{t.catalogIntro}</p>
        </section>
        <ProjectGallery locale={l} full />
        <ProjectCTA locale={l} />
      </>
    );
  else if (path.length === 2 && route === "realisations") {
    const project = projects.find((p) => p.slug === path[1]);
    if (!project) notFound();
    content = (
      <>
        <section className="section page-intro">
          <Link className="breadcrumb" href={`/${l}/realisations`}>
            ← {t.back}
          </Link>
          <h1>{project.titles[l]}</h1>
          <p>
            LUXUS DESIGN ·{" "}
            {t.categoryNames[project.category === "modernes" ? 0 : 3]}
          </p>
        </section>
        <div className="section">
          <ImageGallery
            images={project.images}
            title={project.titles[l]}
            locale={l}
          />
          <div className="detail-copy">
            <div>
              <h2>{t.details}</h2>
              <p>{t.detailText}</p>
            </div>
            <div>
              <h2>{t.provided}</h2>
              <p>{t.providedText}</p>
              <Button href={`/${l}/contact`}>{t.ask}</Button>
            </div>
          </div>
          <h2 className="related-title">{t.related}</h2>
          <div className="related-grid">
            {projects
              .filter((p) => p.slug !== project.slug)
              .slice(0, 3)
              .map((p) => (
                <ProjectCard key={p.slug} project={p} locale={l} />
              ))}
          </div>
        </div>
      </>
    );
  } else if (
    path.length === 1 &&
    (route === "sur-mesure" || route === "a-propos")
  ) {
    content = (
      <>
        <section className="section editorial-intro page-intro">
          <div>
            <p className="eyebrow">
              LUXUS DESIGN · {t.nav[route === "a-propos" ? 4 : 2]}
            </p>
            <h1>{route === "a-propos" ? t.aboutTitle : t.custom.join(" ")}</h1>
            <p>{route === "a-propos" ? t.aboutText : t.customText}</p>
            <Button href={`/${l}/contact`}>{t.ask}</Button>
          </div>
          <div className="editorial-photo">
            <Image
              src={route === "a-propos" ? "/images/hero-main.webp" : "/images/project-6.webp"}
              alt={t.categoryNames[0]}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </section>
        <section className="section process">
          <h2>{route === "a-propos" ? about[l].title : t.processTitle}</h2>
          <div className="process-grid">
            {(route === "a-propos" ? about[l].items.map(item => item.title) : t.steps).map((step, i) => (
              <article key={step}>
                <span>0{i + 1}</span>
                <h3>{step}</h3>
                <p>{route === "a-propos" ? about[l].items[i].text : t.stepTexts[i]}</p>
              </article>
            ))}
          </div>
        </section>
        {route !== "a-propos" && <CustomServices locale={l} />}
        <ProjectCTA locale={l} />
      </>
    );
  } else if (
    route === "services" &&
    path.length === 2 &&
    servicePaths.includes(path[1])
  ) {
    const i = servicePaths.indexOf(path[1]);
    content = (
      <>
        <section className="section editorial-intro page-intro">
          <div>
            <p className="eyebrow">{t.services[i]}</p>
            <h1>{[t.wallpaper, t.fabric, t.lighting][i]}</h1>
            <p>{t.serviceIntro}</p>
            <p>{t.materialNote}</p>
            <Button
              href={`/${l}/contact?service=${i === 0 ? 2 : i === 1 ? 1 : 3}`}
            >
              {t.ask}
            </Button>
          </div>
          <div className="editorial-photo service-detail">
            <Image
              src={`/images/service-${i}.webp`}
              alt={t.services[i]}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </section>
        <ProjectCTA locale={l} />
      </>
    );
  } else if (route === "services" && path.length === 1)
    content = (
      <>
        <section className="section page-intro">
          <h1>{t.ourServices}</h1>
          <p>{t.serviceIntro}</p>
        </section>
        <CustomServices locale={l} />
      </>
    );
  else if (route === "contact" && path.length === 1)
    content = (
      <section className="section contact-page page-intro">
        <div className="contact-intro">
          <p className="eyebrow">LUXUS DESIGN · {t.nav[5]}</p>
          <h1>{t.formTitle}</h1>
          <p>{t.formIntro}</p>
          <div className="contact-photo">
            <Image
              src="/images/project-1.webp"
              alt={t.categoryNames[3]}
              fill
              sizes="(max-width:768px) 100vw, 40vw"
            />
          </div>
        </div>
        <QuoteForm
          locale={l}
          configured={!!process.env.QUOTE_WEBHOOK_URL}
          whatsapp={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        />
      </section>
    );
  else if (
    path.length === 1 &&
    (route === "confidentialite" || route === "mentions-legales")
  )
    content = (
      <section className="section legal-page page-intro">
        <p className="eyebrow">LUXUS DESIGN</p>
        <h1>{route === "confidentialite" ? t.privacy : t.legal}</h1>
        <p className="form-notice">{t.draft}</p>
        <p>{route === "confidentialite" ? t.privacyText : t.legalText}</p>
        <Button href={`/${l}/contact`}>{t.contact}</Button>
      </section>
    );
  else notFound();
  const heroImages: Record<string, string> = {
    salons: "/images/hero-main.webp",
    "sur-mesure": "/images/project-6.webp",
    realisations: "/images/project-1.webp",
    "a-propos": "/images/hero-main.webp",
    contact: "/images/project-1.webp",
  };
  const heroImage = path.length === 1 ? heroImages[route] : undefined;
  const heroTitle = t.nav[navPaths.indexOf(route)];
  return (
    <>
      <NavigationTransition className={heroImage ? "inner-page has-route-hero" : path.length ? "inner-page" : ""}>
        {heroImage && (
          <section className="hero route-hero" aria-label={heroTitle}>
            <div className="hero-photo">
              <Image src={heroImage} alt={heroTitle} fill priority sizes="100vw" quality={90} />
            </div>
            <div className="hero-shade" />
            <div className="hero-content">
              <p className="eyebrow">LUXUS DESIGN</p>
              <h2 className="route-hero-title">{heroTitle}</h2>
              <p className="hero-intro">{route === "salons" || route === "realisations" ? t.catalogIntro : route === "sur-mesure" ? t.customText : route === "a-propos" ? t.aboutText : t.formIntro}</p>
            </div>
          </section>
        )}
        {content}
      </NavigationTransition>
      <Footer locale={l} />
    </>
  );
}
