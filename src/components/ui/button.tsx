import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/audio";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0.5 active:duration-75 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-100 hover:translate-y-0 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-100 hover:translate-y-0",
        hero: "relative overflow-hidden bg-[image:var(--gradient-cyan)] text-primary-foreground font-semibold shadow-[var(--glow-cyan)] hover:brightness-110 btn-shimmer pulse-glow",
        warm: "relative overflow-hidden bg-[image:var(--gradient-amber)] text-primary-foreground font-semibold hover:brightness-110 btn-shimmer pulse-glow-amber",
        frost:
          "glass glass-hover text-foreground font-semibold backdrop-blur-xl hover:text-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 max-sm:min-h-[48px]",
        sm: "h-8 rounded-md px-3 text-xs max-sm:min-h-[48px]",
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
