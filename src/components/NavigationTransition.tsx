"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function NavigationTransition({ children, className }: { children: ReactNode; className: string }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  return (
    <motion.main
      key={pathname}
      id="main"
      className={className}
      initial={false}
      animate={reduced ? { opacity: 1 } : { opacity: [0.7, 1] }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
