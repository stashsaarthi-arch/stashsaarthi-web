import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
};

export function Tilt3D({ children, className }: Props) {
  return (
    <div
      className={cn(
        "relative transition-transform duration-300 ease-out hover:-translate-y-1 will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}
