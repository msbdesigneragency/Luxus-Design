"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { routeContentCommitted } from "./RouteTransitions";
export function NavigationTransition({ children, footer, className, routeKey }: { children: ReactNode; footer: ReactNode; className: string; routeKey: string }) {
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (content.current) routeContentCommitted(content.current, routeKey);
  }, [routeKey]);
  const home = routeKey.replace(/\/$/, "").split("/").length === 2;
  return <div className="route-stage"><div className="route-content" data-desktop-arriving="" data-home-arriving={home ? "" : undefined} ref={content}><main id="main" className={className}>{children}</main>{footer}</div><noscript><style>{`.route-content[data-home-arriving] .hero-content,.route-content[data-desktop-arriving] .hero-content{opacity:1;transform:none}`}</style></noscript></div>;
}
