"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { desktopPageArrived } from "./DesktopRouteMotion";

// Updated only after the server-rendered destination content commits.
let renderedRoute: string | undefined;
export function NavigationTransition({ children, className, routeKey }: { children: ReactNode; className: string; routeKey: string }) {
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const changed = renderedRoute !== undefined && renderedRoute !== routeKey;
    renderedRoute = routeKey;
    if (!changed || !main.current || !matchMedia("(min-width: 1101px)").matches) return;
    desktopPageArrived(main.current);
  }, [routeKey]);
  return <main ref={main} id="main" className={className}>{children}</main>;
}
