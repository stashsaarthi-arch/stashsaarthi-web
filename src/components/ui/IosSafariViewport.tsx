import React from "react";
import { useIosSafariViewport } from "../../lib/useIosSafariViewport";
import { usePersona } from "../../context/PersonaContext";
import { getIosSafariViewportTokens } from "../../lib/designTokens";

export interface IosViewportContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  applySafeArea?: boolean;
  applyDvh?: boolean;
}

/**
 * Reusable layout container primitive that fixes iOS Safari 100dvh viewport height jumping
 * and applies safe-area-inset padding automatically.
 */
export const IosViewportContainer: React.FC<IosViewportContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
  applySafeArea = true,
  applyDvh = true,
  ...props
}) => {
  const { isIosSafari } = useIosSafariViewport();
  const { role } = usePersona();
  const tokens = getIosSafariViewportTokens(role);


  const containerClasses = [
    applyDvh ? tokens.utilityClasses.iosViewportFix : "",
    applySafeArea ? tokens.utilityClasses.safeAreaContainer : "",
    isIosSafari ? "ios-safari-detected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  );
};

export default IosViewportContainer;
