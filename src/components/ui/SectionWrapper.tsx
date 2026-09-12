import React from "react";
import {
  VerticalRhythmTier,
  ContainerSizeTier,
  ContainerGutterTier,
  getVerticalRhythmClasses,
  getContainerWidthClasses,
  getContainerGutterClasses,
} from "@/lib/designTokens";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  rhythm?: VerticalRhythmTier;
  containerSize?: ContainerSizeTier;
  gutter?: ContainerGutterTier;
  isFullWidth?: boolean;
  wrapperClassName?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * Standardized Section Wrapper Component
 * Enforces vertical rhythm (4rem / 6rem / 8rem), container max-widths (max-w-7xl, max-w-6xl),
 * and responsive horizontal gutters across the platform.
 */
export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  (
    {
      as: Component = "section",
      rhythm = "standard",
      containerSize = "xl",
      gutter = "standard",
      isFullWidth = false,
      wrapperClassName,
      containerClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const rhythmClasses = getVerticalRhythmClasses(rhythm);
    const containerClasses = getContainerWidthClasses(containerSize);
    const gutterClasses = getContainerGutterClasses(gutter);

    return (
      <Component
        ref={ref}
        className={cn("section-wrapper relative w-full overflow-hidden", rhythmClasses, wrapperClassName, className)}
        {...props}
      >
        {isFullWidth ? (
          children
        ) : (
          <div
            className={cn(
              "section-container-gutter mx-auto w-full",
              containerClasses,
              gutterClasses,
              containerClassName
            )}
          >
            {children}
          </div>
        )}
      </Component>
    );
  }
);

SectionWrapper.displayName = "SectionWrapper";

export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSizeTier;
  gutter?: ContainerGutterTier;
  children: React.ReactNode;
}

/**
 * Reusable Container Primitive for inner section blocks
 */
export const SectionContainer = React.forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ size = "xl", gutter = "standard", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "section-container-gutter mx-auto w-full",
          getContainerWidthClasses(size),
          getContainerGutterClasses(gutter),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionContainer.displayName = "SectionContainer";
