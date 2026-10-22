"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";

// Updated only after the server-rendered destination content commits.
let renderedRoute: string | undefined;
export function NavigationTransition({ children, className, routeKey }: { children: ReactNode; className: string; routeKey: string }) {
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const changed = renderedRoute !== undefined && renderedRoute !== routeKey;
    renderedRoute = routeKey;
    if (!changed || !main.current || !matchMedia("(min-width: 1101px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const entrance = main.current.animate(
      [{ opacity: 0.65, transform: "translate3d(0,4px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
      { duration: 240, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    return () => entrance.cancel();
  }, [routeKey]);
  return <main ref={main} id="main" className={className}>{children}</main>;
}
