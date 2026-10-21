"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const homeSections = ["accueil", "collections", "sur-mesure", "realisations", "a-propos", "contact"];

export function useExperience(pathname: string, home: boolean, reduced: boolean | null) {
  const header = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  const historyNavigation = useRef(false);
  const revealed = useRef(new WeakSet<Element>());
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const restore = () => { historyNavigation.current = window.location.pathname !== previousPath.current; };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useLayoutEffect(() => {
    const element = header.current;
    if (!element) return;
    const measure = () => document.documentElement.style.setProperty("--nav-height", `${element.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    const restoring = historyNavigation.current;
    historyNavigation.current = false;
    if (!changed || restoring || window.location.hash) return;
    // Let Next finish its catch-all route scroll handling before starting at the top.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!home) return;
    const elements = homeSections.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const offset = header.current?.getBoundingClientRect().height || 84;
      const update = () => {
        const current = elements.filter(el => el.getBoundingClientRect().top <= offset + 32).at(-1);
        setActive(current?.id || "accueil");
      };
      // A narrow band below the navbar also detects the start of very tall mobile sections.
      const bandTop = offset + 24;
      observer = new IntersectionObserver(update, { rootMargin: `-${bandTop}px 0px -${Math.max(0, window.innerHeight - bandTop - 2)}px 0px`, threshold: 0 });
      elements.forEach(el => observer.observe(el));
      update();
    };
    observe();
    window.addEventListener("resize", observe);
    return () => { observer.disconnect(); window.removeEventListener("resize", observe); };
  }, [home, pathname]);

  useEffect(() => {
    if (reduced) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (revealed.current.has(entry.target)) return;
        revealed.current.add(entry.target);
        const index = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
        const animation = entry.target.animate(
          [{ opacity: 0.5, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 700, delay: Math.min(index * 70, 210), easing: "cubic-bezier(.22,1,.36,1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(
      ".section-heading, .custom-panel > h2, .custom-panel > p, .service-card, .cta-content > h2, .cta-content > p, .editorial-photo, .process article, .contact-photo, .page-intro h1, .page-intro > p, .editorial-intro > div > p, .instagram-grid a",
    ).forEach(el => { if (!el.closest(".reference-testimonials")) observer.observe(el); });
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [pathname, reduced]);

  return { header, active };
}
