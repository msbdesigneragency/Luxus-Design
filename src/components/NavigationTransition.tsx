"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { routeContentCommitted } from "./RouteTransitions";
export function NavigationTransition({ children, footer, className, routeKey }: { children: ReactNode; footer: ReactNode; className: string; routeKey: string }) {
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (content.current) routeContentCommitted(content.current, routeKey);
  }, [routeKey]);
  return <div className="route-stage"><div className="route-content" ref={content}><main id="main" className={className}>{children}</main>{footer}</div></div>;
}
