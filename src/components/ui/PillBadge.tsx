import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillBadgeVariants = cva(
  "inline-flex items-baseline gap-1.5 rounded-full font-medium tracking-wide transition-all duration-200 select-none badge-align-baseline micro-copy-baseline",
  {
    variants: {
      variant: {
        default: "bg-primary/10 border border-primary/20 text-primary",
        persona: "bg-[var(--persona-accent)]/15 border border-[var(--persona-accent)]/30 text-[var(--persona-accent)] shadow-[var(--shadow-subtle)]",
        emerald: "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 dark:text-emerald-300",
        amber: "bg-amber-500/10 border border-amber-500/25 text-amber-400 dark:text-amber-300",
        cyan: "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 dark:text-cyan-300",
        glass: "glass text-foreground backdrop-blur-md border-white/10",
        glow: "bg-[var(--persona-accent)] text-slate-950 font-bold shadow-[0_0_12px_var(--persona-glow)]",
        subtle: "bg-muted/50 border border-border/40 text-muted-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PillBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillBadgeVariants> {
  icon?: React.ReactNode;
  pulseDot?: boolean;
  pulseColor?: "mint" | "amber" | "cyan" | "emerald" | "red";
}

function PillBadge({
  className,
  variant,
  size,
  icon,
  pulseDot = false,
  pulseColor = "mint",
  children,
  ...props
}: PillBadgeProps) {
  const pulseColorClasses = {
    mint: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
    amber: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
    cyan: "bg-cyan-400 shadow-[0_0_8px_#06b6d4]",
    emerald: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    red: "bg-rose-500 shadow-[0_0_8px_#f43f5e]",
  };

  return (
    <div className={cn(pillBadgeVariants({ variant, size, className }))} {...props}>
      {pulseDot && (
        <span className="relative flex h-2 w-2 items-center justify-center self-center">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              pulseColorClasses[pulseColor]
            )}
          />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", pulseColorClasses[pulseColor])} />
        </span>
      )}
      {icon && <span className="shrink-0 [&_svg]:size-3.5 icon-align-baseline">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

export { PillBadge, pillBadgeVariants };
