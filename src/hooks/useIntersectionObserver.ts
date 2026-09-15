import { useState, useEffect, type RefObject } from "react";

export function useIsIntersecting(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0.05 }
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setIsIntersecting(entry.isIntersecting);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return isIntersecting;
}
