"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { routeContentCommitted } from "./RouteTransitions";
export function NavigationTransition({ children, footer, className, routeKey }: { children: ReactNode; footer: ReactNode; className: string; routeKey: string }) {
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (content.current) routeContentCommitted(content.current, routeKey);
  }, [routeKey]);
  return <div className="route-stage"><div className="route-content" data-page-entering={routeKey} ref={content}><main id="main" className={className}>{children}</main>{footer}</div><noscript><style>{`.route-content[data-page-entering] .hero-content :is(.eyebrow,h1,h2,.hero-intro,.button-row),.route-content[data-page-entering] :is(.hero-meta,.hero-index){opacity:1;transform:none}.header{animation:none}`}</style></noscript></div>;
}
