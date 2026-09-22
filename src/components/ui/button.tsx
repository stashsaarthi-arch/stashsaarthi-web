import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/audio";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/80 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:translate-y-[0.5px] hover:-translate-y-0.5 active:scale-95 active:opacity-80 active:translate-y-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/[0.08] bg-white/[0.02] shadow-sm hover:bg-white/[0.06] hover:border-white/[0.16] hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-white/[0.05] hover:text-foreground hover:translate-y-0 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0",
        hero: "relative overflow-hidden bg-[image:var(--gradient-cyan)] text-primary-foreground font-semibold shadow-[0_4px_16px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(16,185,129,0.45)] hover:brightness-105 btn-shimmer pulse-glow",
        heroMint:
          "relative overflow-hidden bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-bold shadow-[0_4px_16px_-2px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(16,185,129,0.45)] hover:brightness-105 btn-shimmer pulse-glow",
        heroEmerald:
          "relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 text-slate-950 font-bold shadow-[0_4px_16px_-2px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_-2px_rgba(16,185,129,0.5)] hover:brightness-105 btn-shimmer pulse-glow-emerald",
        heroCyan:
          "relative overflow-hidden bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 text-slate-950 font-bold shadow-[0_4px_16px_-2px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(6,182,212,0.45)] hover:brightness-105 btn-shimmer pulse-glow",
        warm: "relative overflow-hidden bg-[image:var(--gradient-amber)] text-slate-950 font-bold shadow-[0_4px_16px_-2px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(245,158,11,0.45)] hover:brightness-105 btn-shimmer pulse-glow-amber",
        frost:
          "glass glass-hover text-foreground font-semibold backdrop-blur-xl hover:text-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 max-sm:min-h-[44px]",
        sm: "h-8 rounded-lg px-3 text-xs max-sm:min-h-[40px]",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      if (onClick) onClick(e);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
