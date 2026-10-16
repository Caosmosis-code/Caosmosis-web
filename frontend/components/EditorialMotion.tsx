"use client";

import { AnimatePresence, motion, useScroll, useTransform, type HTMLMotionProps, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <motion.div aria-hidden="true" className="reading-progress" style={{ scaleX, transformOrigin: "0%" }} />;
}

export function Parallax({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [16, -16]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

export function MotionButton({ children, className = "", ...props }: HTMLMotionProps<"button">) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className={className} {...props}>{children}</motion.button>;
}
