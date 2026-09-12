import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/audio";
import { Loader2 } from "lucide-react";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-xl transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        glass: "glass glass-hover text-foreground backdrop-blur-xl",
        persona: "bg-[var(--persona-accent)]/15 border border-[var(--persona-accent)]/30 text-[var(--persona-accent)] hover:bg-[var(--persona-accent)] hover:text-slate-950 shadow-[var(--shadow-subtle)]",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground",
      },
      size: {
        sm: "h-8 w-8 min-h-[32px] min-w-[32px] [&_svg]:size-4",
        default: "h-10 w-10 min-h-[40px] min-w-[40px] [&_svg]:size-5",
        lg: "h-12 w-12 min-h-[48px] min-w-[48px] [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  "aria-label": string;
  isLoading?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, isLoading = false, onClick, children, "aria-label": ariaLabel, disabled, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) return;
      playClick();
      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={cn(iconButtonVariants({ variant, size, className }))}
        onClick={handleClick}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
