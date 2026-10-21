"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function NavigationTransition({ children, className }: { children: ReactNode; className: string }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLElement>();

  useLayoutEffect(() => {
    if (!scope.current) return;
    if (reduced) { animate(scope.current, { opacity: 1, y: 0 }, { duration: 0 }); return; }
    const entrance = animate(scope.current, { opacity: [0.72, 1], y: [10, 0] }, {
      duration: 0.42, ease: [0.22, 1, 0.36, 1],
    });
    return () => entrance.stop();
  }, [pathname, reduced, animate, scope]);

  useEffect(() => {
    if (reduced) return;
    let departure: ReturnType<typeof animate> | undefined;
    const leave = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
      if (scope.current) departure = animate(scope.current, { opacity: 0.86, y: -4 }, { duration: 0.16, ease: "easeOut" });
    };
    document.addEventListener("click", leave, true);
    return () => { document.removeEventListener("click", leave, true); departure?.stop(); };
  }, [pathname, reduced, animate, scope]);

  useEffect(() => {
    if (reduced || !scope.current) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const stagger = Math.min(siblings.indexOf(entry.target), 3) * 65;
        animations.push(entry.target.animate(
          [{ opacity: 0.65, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 560, delay: stagger, easing: "cubic-bezier(.22,1,.36,1)" },
        ));
      });
    }, { threshold: 0.1 });
    scope.current.querySelectorAll(
      ".page-intro h1, .page-intro > p, .editorial-intro > div > p, .editorial-photo, .contact-photo, .process article, .custom-panel > h2, .custom-panel > p, .cta-content > h2, .cta-content > p, .section-heading, .instagram-grid a",
    ).forEach(element => { if (!element.closest(".reference-testimonials")) observer.observe(element); });
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [pathname, reduced, scope]);

  return (
    <motion.main
      ref={scope}
      id="main"
      className={className}
      initial={false}
    >
      {children}
    </motion.main>
  );
}
