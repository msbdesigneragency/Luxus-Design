"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Instagram,
  UserRound,
  Diamond,
  Truck,
  Settings2,
  Quote,
  Download,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { copy, Locale, locales, navPaths, categoryKeys } from "@/lib/i18n";
import { projects, Project } from "@/data/projects";
import { referenceContent } from "@/data/reference-content";
import { quoteSchema } from "@/lib/quote";
export function Arrow({ circle = false }: { circle?: boolean }) {
  return (
    <span className={circle ? "circle-arrow" : "arrow"}>
      <ArrowRight size={17} strokeWidth={1.3} />
    </span>
  );
}
export function Button({
  href,
  children,
  outline = false,
}: {
  href: string;
  children: ReactNode;
  outline?: boolean;
}) {
  return (
    <Link className={`button ${outline ? "outline" : ""}`} href={href}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y: 0 }}
      whileInView={reduced ? {} : { opacity: [0.65, 1], y: [14, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`brand ${footer ? "brand-dark" : ""}`}>
      <Image
        src={`/images/brand-${footer ? "black" : "white"}.webp`}
        alt="LUXUS DESIGN — Interior Luxury Design"
        width={250}
        height={42}
        className="brand-image"
        priority={!footer}
      />
    </span>
  );
}
export function Header({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const t = copy[locale],
    pathname = usePathname(),
    search = useSearchParams();
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  const home = pathname === `/${locale}`;
  useLayoutEffect(() => {
    // Catch-all routes share a page shell, so Next can retain its old scroll offset.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Finish after Next's own post-commit scroll handling, including smooth scrolling.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 35);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("a,button,select") || [],
      );
    elements()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const list = elements();
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const langChange = (value: string) => {
    const parts = pathname.split("/");
    parts[1] = value;
    window.location.href =
      parts.join("/") + (search.toString() ? `?${search}` : "");
  };
  const languages = (
    <select
      aria-label={t.language}
      value={locale}
      onChange={(e) => langChange(e.target.value)}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {l.toUpperCase()}
        </option>
      ))}
    </select>
  );
  return (
    <>
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <header className={`header ${!home || scrolled ? "solid" : ""}`}>
        <Link href={`/${locale}`} aria-label="LUXUS DESIGN">
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label={t.navigation}>
          {navPaths.map((p, i) => (
            <Link
              key={p}
              className={
                pathname === `/${locale}${p ? "/" + p : ""}` ? "active" : ""
              }
              href={`/${locale}/${p}`}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>
        <div className="header-end">
          <Link className="header-quote" href={`/${locale}/contact`}>
            {t.quote}
            <ArrowRight size={15} />
          </Link>
          <div className="desktop-lang">{languages}</div>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={t.menu}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      {open && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.navigation}
          id="mobile-nav"
          ref={menuRef}
        >
          <div className="mobile-menu-top">
            <Brand />
            <button
              aria-label={t.close}
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              <X />
            </button>
          </div>
          <nav>
            {navPaths.map((p, i) => (
              <motion.div
                key={p}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/${locale}/${p}`} onClick={() => setOpen(false)}>
                  <small>0{i + 1}</small>
                  {t.nav[i]}
                  <ArrowUpRight />
                </Link>
              </motion.div>
            ))}
          </nav>
          {languages}
          <Link
            className="button"
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
          >
            {t.quote}
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </>
  );
}
export function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale],
    reduced = useReducedMotion();
  return (
    <section className="hero">
      <motion.div
        className="hero-photo"
        initial={reduced ? false : { scale: 1.035 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/images/hero-main.webp"
          alt={t.categoryNames[3]}
          fill
          priority
          sizes="100vw"
          quality={90}
        />
      </motion.div>
      <div className="hero-shade" />
      <div className="hero-content">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
        >
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.hero[0]}
            <br />
            {t.hero[1]}
          </h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="button-row">
            <Button href={`/${locale}/realisations`}>{t.discover}</Button>
            <Button outline href={`/${locale}/contact`}>
              {t.ask}
            </Button>
          </div>
        </motion.div>
      </div>
      <p className="hero-meta">
        {t.projectLabel}
        <br />
        {t.country}
      </p>
      <div className="hero-index" aria-hidden="true">
        01
        <span />
        —
      </div>
    </section>
  );
}
export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/realisations/${project.slug}`}
      className="image-card project-card"
    >
      <div className="card-photo">
        <Image
          src={project.image}
          alt={project.titles[locale]}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1000px) 50vw, 45vw"
        />
      </div>
      <div className="card-caption">
        <div>
          <h3>{project.titles[locale]}</h3>
          <p>LUXUS DESIGN</p>
        </div>
        <Arrow circle />
      </div>
    </Link>
  );
}
export function ProjectGallery({
  locale,
  full = false,
}: {
  locale: Locale;
  full?: boolean;
}) {
  const t = copy[locale],
    params = useSearchParams(),
    router = useRouter(),
    filter = params.get("categorie") || "all";
  const options = [
    ["all", t.all],
    ["modernes", t.filters[0]],
    ["sur-mesure", t.filters[1]],
    ...(full ? [["chambres", t.filters[2]]] : []),
  ];
  const matched = projects.filter(
    (p) => filter === "all" || p.category === filter,
  );
  const shown = full ? matched : matched.slice(0, 5);
  return (
    <section className="section projects-section">
      <div className="section-heading">
        <h2>
          {full ? t.nav[3] : t.latest}
          <span />
        </h2>
        <div className="filters" aria-label={t.categories}>
          {options.map(([key, label]) => (
            <button
              key={key}
              aria-pressed={filter === key}
              className={filter === key ? "selected" : ""}
              onClick={() =>
                router.replace(`?categorie=${key}`, { scroll: false })
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {shown.length ? (
        <Reveal
          key={filter}
          className={`project-grid ${full ? "catalog-grid" : ""} ${shown.length < 5 ? "compact-grid" : ""}`}
        >
          {shown.map((p) => (
            <ProjectCard project={p} locale={locale} key={p.slug} />
          ))}
        </Reveal>
      ) : (
        <p className="empty-state">{t.noCategory}</p>
      )}
    </section>
  );
}
export function CategoryCollection({ locale }: { locale: Locale }) {
  const t = copy[locale],
    params = useSearchParams(),
    category = params.get("categorie"),
    index = categoryKeys.indexOf(category || "");
  const selected = category
    ? projects.filter((p) => p.category === category)
    : projects.filter((p) => p.category !== "chambres");
  return (
    <>
      <section className="page-intro section">
        <p className="eyebrow">LUXUS DESIGN Â· {t.nav[1]}</p>
        <h1>{index >= 0 ? t.categoryNames[index] : t.nav[1]}</h1>
        <p>{t.catalogIntro}</p>
        <div className="filters collection-filters">
          <Link
            className={!category ? "selected" : ""}
            href={`/${locale}/salons`}
          >
            {t.all}
          </Link>
          {t.categoryNames.map((name, i) => (
            <Link
              key={name}
              className={category === categoryKeys[i] ? "selected" : ""}
              href={`/${locale}/salons?categorie=${categoryKeys[i]}`}
            >
              {name}
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        {selected.length ? (
          <div className="catalog-grid project-grid">
            {selected.map((p) => (
              <ProjectCard key={p.slug} project={p} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t.noCategory}</p>
            <Button href={`/${locale}/contact`}>{t.ask}</Button>
          </div>
        )}
      </section>
    </>
  );
}
export function ImageGallery({
  images,
  title,
  locale,
}: {
  images: string[];
  title: string;
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  const t = copy[locale];
  return (
    <div
      className="detail-gallery"
      role="region"
      aria-label={t.gallery}
      tabIndex={images.length > 1 ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
        if (e.key === "ArrowLeft")
          setIndex((i) => (i - 1 + images.length) % images.length);
      }}
    >
      <div className="detail-photo">
        <Image
          src={images[index]}
          alt={`${title} Â· ${index + 1}`}
          fill
          priority
          sizes="(max-width:768px) 100vw, 90vw"
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-controls">
          <button
            aria-label={t.previous}
            onClick={() =>
              setIndex((i) => (i - 1 + images.length) % images.length)
            }
          >
            <ChevronLeft />
          </button>
          <span aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <button
            aria-label={t.next}
            onClick={() => setIndex((i) => (i + 1) % images.length)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
export function Highlights({ locale, verified = false }: { locale: Locale; verified?: boolean }) {
  const t = copy[locale];
  const reduced = useReducedMotion();
  const content = referenceContent[locale];
  const icons = [UserRound, Settings2, Diamond, Truck];
  const values = ["5+", "100+", "100%", t.highlights[3]];
  return (
    <section className="reference-statistics" aria-label={content.statisticsLabel}>
      <div className="highlights section">
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            initial={false}
            whileInView={reduced ? {} : { opacity: [0, 1], y: [20, 0] }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon size={36} strokeWidth={1} />
            <p>
              <strong className={i < 3 ? "reference-number" : undefined}>{values[i]}</strong>
              <span>{content.statisticLabels[i]}</span>
            </p>
          </motion.div>
        ))}
      </div>
      {!verified && <p className="reference-disclosure section">{content.statisticsNote}</p>}
    </section>
  );
}
export function Testimonials({ locale, verified = false }: { locale: Locale; verified?: boolean }) {
  const t = copy[locale];
  const content = referenceContent[locale];
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const move = (direction: number) => setActive(index => (index + direction + content.reviews.length) % content.reviews.length);
  const ordered = content.reviews.map((_, offset) => content.reviews[(active + offset) % content.reviews.length]);
  return (
    <section className="section testimonials reference-testimonials" aria-label={t.reviews}>
      <motion.div
        className="section-heading"
        initial={false}
        whileInView={reduced ? {} : { opacity: [0, 1], y: [16, 0] }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2>{t.reviews}<span /></h2>
        <div className="review-controls">
          <button type="button" aria-label={content.previous} aria-controls="reference-reviews" onClick={() => move(-1)}><ArrowRight size={18} className="review-previous" /></button>
          <button type="button" aria-label={content.next} aria-controls="reference-reviews" onClick={() => move(1)}><ArrowRight size={18} /></button>
        </div>
      </motion.div>
      {!verified && <p className="reference-disclosure">{content.reviewNote}</p>}
      <motion.div
        id="reference-reviews"
        className="testimonial-grid reference-review-grid"
        initial={reduced ? false : { opacity: 0.65 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        tabIndex={0}
        role="group"
        aria-label={`${t.reviews}: ${active + 1} / ${content.reviews.length}`}
        onKeyDown={event => {
          if (event.key === "ArrowRight") { event.preventDefault(); move(locale === "ar" ? -1 : 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); move(locale === "ar" ? 1 : -1); }
        }}
        onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
        onTouchEnd={event => {
          if (touchStart.current === null) return;
          const distance = touchStart.current - event.changedTouches[0].clientX;
          if (Math.abs(distance) > 40) move((distance > 0 ? 1 : -1) * (locale === "ar" ? -1 : 1));
          touchStart.current = null;
        }}
      >
        {ordered.map((review, index) => (
          <motion.article
            key={`${active}-${review.attribution}`}
            initial={false}
            whileInView={reduced ? {} : { opacity: [0, 1], y: [22, 0] }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Quote size={25} fill="currentColor" aria-hidden="true" />
            <div>
              <p>{review.text}</p>
              <div className="review-stars" role="img" aria-label={content.stars}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} fill="currentColor" strokeWidth={0} />)}</div>
              <small>{review.attribution}</small>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
export function InstagramStrip({
  locale,
  profile,
}: {
  locale: Locale;
  profile?: string;
}) {
  const t = copy[locale];
  return (
    <section className="section instagram-section">
      <div className="section-heading">
        <h2>
          {t.instagram}
          <span />
        </h2>
        <Link
          href={profile || `/${locale}/realisations`}
          target={profile ? "_blank" : undefined}
          rel={profile ? "noopener noreferrer" : undefined}
        >
          {profile ? "Instagram" : t.instagramLink}
          <Arrow />
        </Link>
      </div>
      <div className="instagram-grid">
        {[
          projects[0],
          projects[3],
          projects[1],
          projects[2],
          projects[9],
          projects[7],
        ].map((p) => (
          <Link
            href={profile || `/${locale}/realisations/${p.slug}`}
            key={p.slug}
            aria-label={p.titles[locale]}
          >
            <Image
              src={p.image}
              fill
              sizes="(max-width:640px) 42vw, 16vw"
              alt={p.titles[locale]}
            />
            {profile && <Instagram size={17} />}
          </Link>
        ))}
      </div>
    </section>
  );
}
export function QuoteForm({
  locale,
  configured,
  whatsapp,
}: {
  locale: Locale;
  configured: boolean;
  whatsapp?: string;
}) {
  const t = copy[locale],
    params = useSearchParams();
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [errors, setErrors] = useState<string[]>([]),
    [download, setDownload] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const payload = () => {
    const d = new FormData(form.current!);
    return {
      name: String(d.get("name") || ""),
      phone: String(d.get("phone") || ""),
      city: String(d.get("city") || ""),
      type: String(d.get("type") || "0"),
      service: String(d.get("service") || "0"),
      dimensions: String(d.get("dimensions") || ""),
      details: String(d.get("details") || ""),
      consent: d.get("consent") === "on",
      locale,
      website: String(d.get("website") || ""),
    };
  };
  const report = (data: ReturnType<typeof payload>) =>
    [
      t.formTitle,
      `${t.fields[0]}: ${data.name}`,
      `${t.fields[1]}: ${data.phone}`,
      `${t.fields[2]}: ${data.city}`,
      `${t.fields[3]}: ${t.types[Number(data.type)]}`,
      `${t.fields[4]}: ${t.serviceList[Number(data.service)]}`,
      `${t.fields[5]}: ${data.dimensions}`,
      `${t.fields[6]}: ${data.details}`,
    ].join("\n");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = payload();
    const checked = quoteSchema.safeParse(data);
    if (!checked.success) {
      setErrors(Object.keys(checked.error.flatten().fieldErrors));
      setStatus("invalid");
      return;
    }
    setErrors([]);
    setBusy(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setStatus(
        response.ok
          ? "success"
          : json.code === "NOT_CONFIGURED"
            ? "notConfigured"
            : "error",
      );
      if (!response.ok) setDownload(report(data));
    } catch {
      setStatus("error");
      setDownload(report(data));
    } finally {
      setBusy(false);
    }
  };
  const input = (name: string, i: number, optional = false) => (
    <label>
      {t.fields[i]}
      <input
        name={name}
        type={name === "phone" ? "tel" : "text"}
        required={!optional}
        minLength={optional ? undefined : 2}
        maxLength={name === "phone" ? 25 : 200}
        autoComplete={
          name === "name"
            ? "name"
            : name === "phone"
              ? "tel"
              : name === "city"
                ? "address-level2"
                : "off"
        }
        aria-invalid={errors.includes(name)}
        aria-describedby={errors.includes(name) ? `${name}-error` : undefined}
      />
      {errors.includes(name) && (
        <small id={`${name}-error`} className="field-error">
          {t.required}
        </small>
      )}
    </label>
  );
  return (
    <form ref={form} className="quote-form" onSubmit={submit}>
      {!configured && <p className="form-notice">{t.setup}</p>}
      <div className="form-grid">
        {input("name", 0)}
        {input("phone", 1)}
        {input("city", 2)}
        <label>
          {t.fields[3]}
          <select name="type">
            {t.types.map((x, i) => (
              <option key={x} value={i}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.fields[4]}
          <select name="service" defaultValue={params.get("service") || "0"}>
            {t.serviceList.map((x, i) => (
              <option key={x} value={i}>
                {x}
              </option>
            ))}
          </select>
        </label>
        {input("dimensions", 5, true)}
        <label className="full-width">
          {t.fields[6]}
          <textarea
            name="details"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            aria-invalid={errors.includes("details")}
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        {t.consent}
      </label>
      <button className="button dark-button" disabled={busy}>
        {busy ? t.submitting : t.submit}
        <ArrowRight size={16} />
      </button>
      {status && (
        <div className="form-result" role="status">
          <p>
            {status === "invalid"
              ? t.error
              : t[status as "success" | "error" | "notConfigured"]}
          </p>
          {download && (
            <button
              type="button"
              className="text-button"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([download], { type: "text/plain;charset=utf-8" }),
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = "luxus-design-demande.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download size={16} />
              {t.download}
            </button>
          )}
        </div>
      )}
      {whatsapp && (
        <button
          type="button"
          className="text-button"
          onClick={() => {
            if (form.current?.reportValidity())
              window.open(
                `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(report(payload()))}`,
                "_blank",
                "noopener,noreferrer",
              );
          }}
        >
          {t.whatsapp}
          <ArrowUpRight size={17} />
        </button>
      )}
    </form>
  );
}

