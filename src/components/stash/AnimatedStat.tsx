import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedStatProps {
  value: string; // e.g. "₹300/mo", "100%", "2-min", "4 hrs"
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Parses stat strings and applies count-up animation.
 * Falls back to static display for unrecognized formats.
 */
export function AnimatedStat({ value, className, style }: AnimatedStatProps) {
  const parsed = parseStatValue(value);

  if (!parsed) {
    return <span className={className} style={style}>{value}</span>;
  }

  const { ref, display } = useCountUp(parsed.num, 1200, parsed.prefix, parsed.suffix);

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={className} style={style}>
      {display}
    </span>
  );
}

function parseStatValue(raw: string): { num: number; prefix: string; suffix: string } | null {
  // Match patterns like "₹300/mo", "100%", "2-min", "4 hrs", "1,200+", "24×7", "₹6,400", etc.
  const match = raw.match(/^([₹$]?)([0-9,]+\.?[0-9]*)(.*)$/);
  if (!match) return null;

  const prefix = match[1] ?? "";
  const numStr = (match[2] ?? "").replace(/,/g, "");
  const suffix = match[3] ?? "";
  const num = parseFloat(numStr);

  if (isNaN(num) || num === 0) return null;

  return { num, prefix, suffix };
}
