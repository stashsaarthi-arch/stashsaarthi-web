import React from "react";
import { cn } from "@/lib/utils";

export interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  tiltCoefficient?: number;
  maxTilt?: number;
}

export function Card3D({ children, className }: Card3DProps) {
  return (
    <div
      className={cn(
        "relative z-10 w-full transition-all duration-300 ease-out hover:-translate-y-1.5 will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}
