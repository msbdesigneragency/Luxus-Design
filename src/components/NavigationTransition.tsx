"use client";
import { useLayoutEffect, type ReactNode } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
export function NavigationTransition({ children, className }: { children: ReactNode; className: string }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLElement>();
  useLayoutEffect(() => {
    if (!scope.current) return;
    // Keep text stationary: one fade, with no nested entrance or page translation.
    const entrance = animate(scope.current, { opacity: reduced ? 1 : [0, 1] }, {
      duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1],
    });
    return () => entrance.stop();
  }, [pathname, reduced, animate, scope]);
  return <motion.main ref={scope} id="main" className={className} initial={false}>{children}</motion.main>;
}
