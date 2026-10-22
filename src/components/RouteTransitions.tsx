"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createDesktopNavigation } from "./DesktopRouteMotion";

// One transition owner for navbar, content links and browser history.
let startNavigation: ((href: string) => void) | null = null;
export function transitionTo(href: string, fallback: () => void) {
  if (startNavigation) startNavigation(href);
  else fallback();
}
export function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const previous = useRef(pathname);
  const animation = useRef<Animation | null>(null);
  const pending = useRef(false);
  const generation = useRef(0);

  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const wasPending = pending.current;
    pending.current = false;
    animation.current?.cancel();
    // Desktop entrance belongs to the destination itself, after its content commits.
    // Keep the existing mobile timing and behavior untouched.
    if (matchMedia("(min-width: 1101px)").matches) return;
    const main = document.getElementById("main");
    if (!main || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animation.current = main.animate(
      [{ opacity: 0.82, transform: "translate3d(0,4px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
      { duration: wasPending ? 200 : 280, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  }, [pathname]);

  useEffect(() => {
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    const desktop = createDesktopNavigation(href => router.push(href, { scroll: false }));
    const navigate = async (href: string) => {
      const destination = new URL(href, location.href);
      if (destination.origin !== location.origin) return;
      // Locale changes use the existing full document navigation: never blend scripts or directions.
      if (destination.pathname.split("/")[1] !== location.pathname.split("/")[1]) {
        location.assign(destination.href);
        return;
      }
      if (matchMedia("(min-width: 1101px)").matches) {
        void desktop.navigate(destination.pathname + destination.search + destination.hash);
        return;
      }
      if (destination.pathname === location.pathname) return;
      clearTimeout(safetyTimer);
      const current = ++generation.current;
      animation.current?.cancel();
      const main = document.getElementById("main");
      pending.current = true;
      if (main && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const desktop = matchMedia("(min-width: 1101px)").matches;
        const outgoing = main.animate([{ opacity: getComputedStyle(main).opacity }, { opacity: desktop ? 0.65 : 0.82 }], {
          duration: desktop ? 80 : 100, easing: "ease-out", fill: "forwards",
        });
        animation.current = outgoing;
        await outgoing.finished.catch(() => {});
      }
      if (current !== generation.current) return;
      safetyTimer = setTimeout(() => {
        if (current === generation.current && pending.current) {
          pending.current = false;
          animation.current?.cancel();
        }
      }, 2500);
      router.push(destination.pathname + destination.search + destination.hash, { scroll: false });
    };
    startNavigation = navigate;
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.closest(".header,.mobile-menu") || link.target || link.hasAttribute("download")) return;
      const destination = new URL(link.href, location.href);
      // Leave filters, same-page anchors and external destinations with their existing handlers.
      if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
      event.preventDefault();
      void navigate(link.href);
    };
    const history = () => {
      desktop.cancel();
      clearTimeout(safetyTimer);
      generation.current++;
      pending.current = false;
      animation.current?.cancel();
    };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", history);
    return () => {
      startNavigation = null;
      history();
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", history);
    };
  }, [router]);
  return null;
}
