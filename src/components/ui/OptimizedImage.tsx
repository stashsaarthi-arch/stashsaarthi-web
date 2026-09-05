import React from "react";

/**
 * A single source-set entry: { src, width }.
 * Width is in pixels (the intrinsic width of the image file).
 */
export interface SrcSetEntry {
  src: string;
  width: number;
}

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "srcSet"> {
  /** Primary image source (must be provided). Used as the `<img>` src fallback. */
  src: string;
  /** Alt text — required for a11y. */
  alt: string;
  /**
   * Optional list of responsive sources for automatic `srcset` generation.
   * Each entry defines an image URL and its intrinsic width in pixels.
   * Example: [{ src: "/images/hero-640w.webp", width: 640 }, { src: "/images/hero-1200w.webp", width: 1200 }]
   */
  srcSetEntries?: SrcSetEntry[];
  /**
   * Optional `sizes` attribute for responsive layout hints.
   * Example: "(max-width: 640px) 100vw, 640px"
   */
  sizes?: string;
  /**
   * Optional WebP source for a `<picture>` element with PNG/JPG fallback.
   * When provided, wraps the `<img>` in a `<picture>` with a WebP `<source>`.
   */
  webpSrc?: string;
  /**
   * Optional WebP srcset entries for the `<source>` element inside `<picture>`.
   */
  webpSrcSetEntries?: SrcSetEntry[];
}

function buildSrcSet(entries: SrcSetEntry[]): string {
  return entries.map((e) => `${e.src} ${e.width}w`).join(", ");
}

/**
 * Reusable optimized image component with:
 * - Automatic `srcset` generation from SrcSetEntry[]
 * - `<picture>` wrapper for WebP-with-fallback when webpSrc is provided
 * - `loading="lazy"` and `decoding="async"` defaults
 * - Full passthrough of standard `<img>` attributes (className, style, width, height, etc.)
 */
export const OptimizedImage = React.memo(function OptimizedImage({
  src,
  alt,
  srcSetEntries,
  sizes,
  webpSrc,
  webpSrcSetEntries,
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: OptimizedImageProps) {
  const imgSrcSet = srcSetEntries?.length ? buildSrcSet(srcSetEntries) : undefined;
  const webpSrcSet = webpSrcSetEntries?.length
    ? buildSrcSet(webpSrcSetEntries)
    : undefined;

  const imgElement = (
    <img
      src={src}
      alt={alt}
      srcSet={imgSrcSet}
      sizes={sizes}
      loading={loading}
      decoding={decoding as "async" | "auto" | "sync" | undefined}
      {...imgProps}
    />
  );

  // Wrap in <picture> only when a WebP alternative is provided
  if (webpSrc || webpSrcSet) {
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={webpSrcSet || webpSrc}
          sizes={sizes}
        />
        {imgElement}
      </picture>
    );
  }

  return imgElement;
});
