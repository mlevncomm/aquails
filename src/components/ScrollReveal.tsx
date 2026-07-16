import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
}

/**
 * Prefer useInView + animate over whileInView.
 * Parent overflow-x-hidden can make IntersectionObserver flaky; a short
 * timeout fallback prevents content staying at opacity:0 forever.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  y = 24,
  x = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForceShow(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  const show = Boolean(reduceMotion || isInView || forceShow);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={show ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion || forceShow ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForceShow(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  const show = Boolean(reduceMotion || isInView || forceShow);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={show ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion || forceShow ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
