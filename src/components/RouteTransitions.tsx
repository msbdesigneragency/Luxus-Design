"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

let navigate: ((href: string) => void) | undefined;
let surface: HTMLElement | null = null;
let active: Animation | undefined;
let rendered: string | undefined;
let intended: string | undefined;
let phase: "idle" | "leaving" | "entering" = "idle";
let until = 0;
let revision = 0;
const pathOf = (href: string) => new URL(href, location.href).pathname.replace(/\/$/, "");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const opacity = () => {
  const value = surface?.isConnected ? Number.parseFloat(getComputedStyle(surface).opacity) : 0.2;
  return Number.isFinite(value) ? Math.max(0.2, Math.min(1, value)) : 0.2;
};
function stopAt(value: number) {
  if (surface) surface.style.opacity = String(value);
  active?.cancel();
  active = undefined;
}
function leave() {
  if (!surface || reduced() || phase !== "idle") return;
  phase = "leaving";
  active = surface.animate([{opacity: 1}, {opacity: 0.2}], {duration: 100, easing: "ease-out", fill: "forwards"});
}
export function transitionTo(href: string, fallback: () => void) {
  if (navigate) navigate(href); else fallback();
}
// Called by the content boundary only when the destination DOM has committed.
export function routeContentCommitted(node: HTMLElement, routeKey: string) {
  const key = routeKey.replace(/\/$/, "");
  if (rendered === key && surface === node) return;
  const first = rendered === undefined;
  const from = phase === "idle" && !intended ? 0.2 : opacity();
  const remaining = phase === "entering" ? Math.max(0, until - performance.now()) : phase === "leaving" ? 160 : 220;
  stopAt(from);
  surface = node;
  rendered = key;
  if (first || reduced()) {
    node.style.opacity = "";
    phase = "idle";
    intended = undefined;
    return;
  }
  node.style.opacity = String(from);
  const current = ++revision;
  const images = [...node.querySelectorAll<HTMLImageElement>("img")].filter(img => {
    const box = img.getBoundingClientRect();
    return box.bottom > 0 && box.top < innerHeight && box.width > 0;
  });
  // Actual font/image readiness, not a timer; off-screen lazy images retain their reserved boxes.
  void Promise.all([document.fonts.ready, ...images.map(img => img.decode().catch(() => {}))]).then(() => {
    if (current !== revision || (intended && intended !== key)) return;
    intended = undefined;
    if (remaining <= 0) { node.style.opacity = ""; phase = "idle"; return; }
    phase = "entering";
    until = performance.now() + remaining;
    const entrance = node.animate([{opacity: from}, {opacity: 1}], {duration: remaining, easing: "ease-out", fill: "forwards"});
    active = entrance;
    void entrance.finished.then(() => {
      if (active !== entrance) return;
      node.style.opacity = "";
      entrance.cancel();
      active = undefined;
      phase = "idle";
    }).catch(() => {});
  });
}
export function RouteTransitions() {
  const router = useRouter();
  useEffect(() => {
    navigate = href => {
      const target = new URL(href, location.href);
      if (target.origin !== location.origin) return;
      if (target.pathname.split("/")[1] !== location.pathname.split("/")[1]) { location.assign(target.href); return; }
      const key = pathOf(href);
      if (key === pathOf(location.href)) {
        if (intended) {
          intended = undefined;
          revision++;
          stopAt(1);
          phase = "idle";
          router.push(target.pathname + target.search + target.hash, {scroll: false});
        }
        return;
      }
      intended = key;
      leave();
      // Start fetching/routing immediately; do not queue clicks or wait for the exit animation.
      router.push(target.pathname + target.search + target.hash, {scroll: false});
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.closest(".header,.mobile-menu") || link.target || link.hasAttribute("download")) return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.pathname === location.pathname) return;
      event.preventDefault();
      navigate?.(link.href);
    };
    const history = () => { intended = undefined; };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", history);
    return () => {
      navigate = undefined;
      revision++;
      stopAt(1);
      phase = "idle";
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", history);
    };
  }, [router]);
  return null;
}
