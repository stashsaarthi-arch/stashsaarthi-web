import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { playClick } from "@/lib/audio";
import { X } from "lucide-react";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-xl border text-xs font-medium transition-all duration-200 select-none cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
        outline: "border-border bg-transparent text-foreground hover:bg-accent/10",
        persona: "border-[var(--persona-accent)]/30 bg-muted/30 text-foreground hover:border-[var(--persona-accent)] hover:bg-[var(--persona-accent)]/10",
        glass: "glass glass-hover text-foreground backdrop-blur-md",
      },
      size: {
        sm: "px-2.5 py-1 text-[11px]",
        default: "px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
      isSelected: {
        true: "bg-[var(--persona-accent)] text-slate-950 border-[var(--persona-accent)] font-bold shadow-[0_0_12px_var(--persona-glow)] hover:brightness-110",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isSelected: false,
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  isSelected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

function Chip({
  className,
  variant,
  size,
  isSelected = false,
  onRemove,
  icon,
  disabled = false,
  onClick,
  onKeyDown,
  children,
  ...props
}: ChipProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    playClick();
    if (onClick) onClick(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      playClick();
      if (onClick) onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
    if (onKeyDown) onKeyDown(e);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    playClick();
    if (onRemove) onRemove();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={disabled}
      className={cn(
        chipVariants({ variant, size, isSelected, className }),
        disabled && "opacity-50 pointer-events-none cursor-not-allowed"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {icon && <span className="shrink-0 [&_svg]:size-3.5">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove chip"
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
          onClick={handleRemove}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

export { Chip, chipVariants };
