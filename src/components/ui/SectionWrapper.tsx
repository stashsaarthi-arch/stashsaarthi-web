import React from "react";
import {
  VerticalRhythmTier,
  ContainerSizeTier,
  ContainerGutterTier,
  LayoutIsolationTier,
  getVerticalRhythmClasses,
  getContainerWidthClasses,
  getContainerGutterClasses,
  getLayoutIsolationClasses,
} from "@/lib/designTokens";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  rhythm?: VerticalRhythmTier;
  containerSize?: ContainerSizeTier;
  gutter?: ContainerGutterTier;
  isFullWidth?: boolean;
  isIsolated?: boolean;
  isolationTier?: LayoutIsolationTier;
  wrapperClassName?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * Standardized Section Wrapper Component
 * Enforces vertical rhythm (4rem / 6rem / 8rem), container max-widths (max-w-7xl, max-w-6xl),
 * responsive horizontal gutters, and layout isolation (contain: layout style) across the platform.
 */
export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  (
    {
      as: Component = "section",
      rhythm = "standard",
      containerSize = "xl",
      gutter = "standard",
      isFullWidth = false,
      isIsolated = true,
      isolationTier = "layoutStyle",
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
    const isolationClasses = isIsolated ? getLayoutIsolationClasses(isolationTier) : "";

    return (
      <Component
        ref={ref}
        className={cn(
          "section-wrapper relative w-full overflow-hidden",
          rhythmClasses,
          isolationClasses,
          wrapperClassName,
          className
        )}
        {...props}
      >
        {isFullWidth ? (
          children
        ) : (
          <div
            className={cn(
              "section-container-gutter mobile-gutter-safe mx-auto w-full",
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
          "section-container-gutter mobile-gutter-safe mx-auto w-full",
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
