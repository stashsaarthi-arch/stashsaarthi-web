import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `end` when the element scrolls into view.
 * Returns a ref to attach to the container, plus the current animated value.
 *
 * @param end - target number to count up to
 * @param duration - animation duration in ms (default 1200)
 * @param prefix - string prepended (e.g. "₹")
 * @param suffix - string appended (e.g. "+", "%", "/mo")
 */
export function useCountUp(
  end: number,
  duration = 1200,
  prefix = "",
  suffix = "",
): { ref: React.RefObject<HTMLElement | null>; display: string } {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo for a snappy feel
            const eased = 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return {
    ref,
    display: `${prefix}${value.toLocaleString("en-IN")}${suffix}`,
  };
}
