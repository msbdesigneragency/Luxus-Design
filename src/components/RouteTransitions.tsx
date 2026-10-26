"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pageEntrance } from "./PageEntrance";
let navigate: ((href: string) => void) | undefined;
let boundary: HTMLElement | null = null;
let rendered: string | undefined;
let stopEntrance: (() => void) | undefined;
let restoring = false;
export function transitionTo(href: string, fallback: () => void) {
  if (navigate) navigate(href); else fallback();
}
export function routeContentCommitted(node: HTMLElement, routeKey: string) {
  const key = routeKey.replace(/\/$/, "");
  if (rendered === key && boundary === node) return;
  stopEntrance?.();
  boundary = node;
  rendered = key;
  stopEntrance = pageEntrance(node, restoring);
  restoring = false;
}
export function RouteTransitions() {
  const router = useRouter();
  useEffect(() => {
    navigate = href => {
      const target = new URL(href, location.href);
      if (target.origin !== location.origin) return;
      router.push(target.pathname + target.search + target.hash, {scroll: false});
    };
    const history = () => { restoring = location.pathname.replace(/\/$/, "") !== rendered; };
    window.addEventListener("popstate", history);
    return () => {
      navigate = undefined;
      window.removeEventListener("popstate", history);
    };
  }, [router]);
  return null;
}
