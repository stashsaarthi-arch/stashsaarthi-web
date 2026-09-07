import React from "react";
import { cn } from "@/lib/utils";
import { isLowDataModeEnabled } from "@/context/LowDataContext";

export interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  tiltCoefficient?: number;
  maxTilt?: number;
}

export const Card3D = React.memo(function Card3D({ children, className }: Card3DProps) {
  const [isLowData, setIsLowData] = React.useState(false);

  React.useEffect(() => {
    setIsLowData(isLowDataModeEnabled());
  }, []);

  return (
    <div
      className={cn(
        "relative z-10 w-full transition-all duration-300 ease-out",
        !isLowData && "hover:-translate-y-1.5 will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
});
