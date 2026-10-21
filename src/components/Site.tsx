import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, Instagram } from "lucide-react";
import { copy, Locale, navPaths, servicePaths, categoryKeys } from "@/lib/i18n";

import {
  Arrow,
  Brand,
  Button,
  Hero,
  Highlights,
  InstagramStrip,
  ProjectGallery,
  Reveal,
  Testimonials,
} from "./Interactive";
export function Heading({
  title,
  href,
  label,
}: {
  title: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <h2>
        {title}
        <span />
      </h2>
      {href && (
        <Link href={href}>
          {label}
          <Arrow />
        </Link>
      )}
    </div>
  );
}
export function Categories({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const images = [
    "/images/project-6.webp",
    "/images/project-2.webp",
    "/images/hero-main.webp",
    "/images/project-1.webp",
  ];
  return (
    <section id="collections" className="section categories">
      <Heading
        title={t.categories}
        href={`/${locale}/salons`}
        label={t.allCategories}
      />
      <div className="category-grid">
        {t.categoryNames.map((name, i) => (
          <Reveal key={name}>
            <Link
              className="image-card category-card"
              href={`/${locale}/salons?categorie=${categoryKeys[i]}`}
            >
              <div className="card-photo">
                <Image
                  src={images[i]}
                  alt={i === 1 || i === 2 ? t.latest : name}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                />
                {(i === 1 || i === 2) && (
                  <span className="collection-preview">
                    {locale === "fr"
                      ? "Inspiration · collection à venir"
                      : locale === "en"
                        ? "Inspiration · collection coming soon"
                        : "إلهام · تشكيلة قادمة"}
                  </span>
                )}
              </div>
              <div className="card-caption">
                <div>
                  <h3>{name}</h3>
                  <p>{t.categorySubs[i]}</p>
                </div>
                <Arrow circle />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function CustomServices({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="custom-services">
      <div className="custom-panel">
        <h2>
          {t.custom[0]}
          <br />
          {t.custom[1]}
        </h2>
        <p>{t.customText}</p>
        <Button href={`/${locale}/sur-mesure`}>{t.create}</Button>
      </div>
      {t.services.map((name, i) => (
        <Link
          className={`service-card service-${i}`}
          key={name}
          href={`/${locale}/services/${servicePaths[i]}`}
        >
          <Image
            src={`/images/service-${i}.webp`}
            alt={name}
            fill
            sizes="(max-width:640px) 100vw, 25vw"
          />
          <div className="service-shade" />
          <div className="service-caption">
            <div>
              <h3>{name}</h3>
              <p>{t.serviceTexts[i]}</p>
            </div>
            <Arrow circle />
          </div>
        </Link>
      ))}
    </section>
  );
}
export function ProjectCTA({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="project-cta">
      <Image
        src="/images/project-cta.webp"
        alt={t.categoryNames[3]}
        fill
        sizes="100vw"
      />
      <div className="cta-shade" />
      <div className="cta-content">
        <h2>{t.cta}</h2>
        <p>{t.ctaText}</p>
        <div className="button-row">
          <Button href={`/${locale}/contact`}>{t.quote}</Button>
          <Button outline href={`/${locale}/contact`}>
            {t.contact}
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Home({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <Categories locale={locale} />
      <CustomServices locale={locale} />
      <ProjectGallery locale={locale} />
      <Highlights locale={locale} verified={process.env.REFERENCE_CLAIMS_VERIFIED === "true"} />
      <ProjectCTA locale={locale} />
      <Testimonials locale={locale} verified={process.env.REFERENCE_CLAIMS_VERIFIED === "true"} />
      <InstagramStrip
        locale={locale}
        profile={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
      />
    </>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE,
    email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL,
    address = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS,
    instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  return (
    <footer className="section footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href={`/${locale}`}>
            <Brand footer />
          </Link>
          <p>{t.footerText}</p>
          {instagram && (
            <a
              href={instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={19} />
            </a>
          )}
        </div>
        <div>
          <h3>{t.navigation}</h3>
          <nav>
            {t.nav.map((name, i) => (
              <Link key={name} href={`/${locale}/${navPaths[i]}`}>
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3>{t.ourServices}</h3>
          <nav>
            {t.serviceList.map((name, i) => (
              <Link
                key={name}
                href={`/${locale}/${i > 0 && i < 4 ? "services/" + servicePaths[i === 1 ? 1 : i === 2 ? 0 : 2] : i === 0 ? "sur-mesure" : "contact"}`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3>{t.nav[5]}</h3>
          <div className="contact-list">
            {phone && (
              <a href={`tel:${phone}`}>
                <Phone size={16} />
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`}>
                <Mail size={16} />
                {email}
              </a>
            )}
            {address && (
              <p>
                <MapPin size={16} />
                {address}
              </p>
            )}
            {!phone && !email && !address && <p>{t.contactPending}</p>}
            <Link href={`/${locale}/contact`}>
              {t.contact}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} LUXUS DESIGN. {t.rights}
        </p>
        <div>
          <Link href={`/${locale}/confidentialite`}>{t.privacy}</Link>
          <span /> <Link href={`/${locale}/mentions-legales`}>{t.legal}</Link>
        </div>
      </div>
    </footer>
  );
}
