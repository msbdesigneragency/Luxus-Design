import type { ReactNode } from "react";
export function NavigationTransition({ children, className }: { children: ReactNode; className: string }) {
  return <main id="main" className={className}>{children}</main>;
}
