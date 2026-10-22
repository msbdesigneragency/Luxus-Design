"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { desktopEntrance } from "./DesktopEntrance";

let navigate: ((href: string) => void) | undefined;
let surface: HTMLElement | null = null;
let boundary: HTMLElement | null = null;
let rendered: string | undefined;
let intended: string | undefined;
let animations: Animation[] = [];
let observer: IntersectionObserver | undefined;
let stopDesktop: (() => void) | undefined;
const pathOf = (href: string) => new URL(href, location.href).pathname.replace(/\/$/, "");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function stopAt(value: number) {
  stopDesktop?.();
  stopDesktop = undefined;
  observer?.disconnect();
  observer = undefined;
  animations.forEach(animation => animation.cancel());
  animations = [];
  boundary?.querySelectorAll<HTMLElement>("[data-section-pending]").forEach(section => {
    section.removeAttribute("data-section-pending");
    section.style.opacity = "";
    section.style.transform = "";
  });
  boundary?.removeAttribute("data-home-arriving");
  if (surface) { surface.style.opacity = String(value); surface.style.transform = ""; }
}
function leave() {
  // Fetch immediately, keeping the current page readable until the next DOM commits.
}
export function transitionTo(href: string, fallback: () => void) {
  if (navigate) navigate(href); else fallback();
}
function reveal(element: HTMLElement, distance: number, from = 0) {
  const animation = element.animate([
    {opacity: from, transform: distance ? 'translateY(' + distance + 'px)' : "none"},
    {opacity: 1, transform: "none"},
  ], {duration: 320, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fill: "both"});
  animations.push(animation);
  element.style.opacity = "";
  element.style.transform = "";
  element.removeAttribute("data-section-pending");
  void animation.finished.then(() => animation.cancel()).catch(() => {});
}
export function routeContentCommitted(node: HTMLElement, routeKey: string) {
  const key = routeKey.replace(/\/$/, "");
  if (rendered === key && boundary === node) return;
  const initial = rendered === undefined;
  stopAt(1);
  boundary = node;
  rendered = key;
  intended = undefined;
  surface = node.querySelector<HTMLElement>(".hero-content") ?? node;
  node.removeAttribute("data-home-arriving");
  if (matchMedia("(min-width: 1101px)").matches) {
    stopDesktop = desktopEntrance(node, initial);
    return;
  }
  node.removeAttribute("data-desktop-arriving");
  if (reduced()) return;
  // No decoding/font promise gates, queues, or inherited deadlines between routes.
  reveal(surface, 4);
  const home = key.split("/").length === 2;
  if (home) {
    const photo = node.querySelector<HTMLElement>(".hero-photo");
    if (photo) reveal(photo, 0, 0.8);
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal(entry.target as HTMLElement, 8);
        observer?.unobserve(entry.target);
      });
    }, {threshold: 0.08});
    node.querySelectorAll<HTMLElement>("main > section:not(.hero)").forEach(section => {
      if (section.getBoundingClientRect().bottom <= 0) return;
      section.setAttribute("data-section-pending", "");
      section.style.opacity = "0";
      section.style.transform = "translateY(8px)";
      observer?.observe(section);
    });
  }
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
          stopAt(1);
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
      stopAt(1);
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", history);
    };
  }, [router]);
  return null;
}
