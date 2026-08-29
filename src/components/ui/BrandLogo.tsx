import React from "react";

export interface BrandLogoProps {
  className?: string;
  iconSize?: number;
  showWordmark?: boolean;
  textClassName?: string;
}

export function BrandLogo({
  className = "",
  iconSize = 36,
  showWordmark = true,
  textClassName = "",
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* ── Official StashSaarthi Infinity Cube Mark ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* Infinity Loop Dual Gradient: Mint/Cyan -> Sunset Amber/Gold */}
          <linearGradient id="infinityGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="45%" stopColor="#06B6D4" />
            <stop offset="65%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Cube Top Face Gradient */}
          <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Cube Left Face Gradient */}
          <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          {/* Cube Right Face Gradient */}
          <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Shadow beneath Cube */}
          <radialGradient id="cubeShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Infinity Loop Ribbon (Base) */}
        {/* Left Loop (Cyan / Mint) */}
        <path
          d="M 32 60 C 20 60, 10 70, 10 80 C 10 90, 20 98, 32 98 C 44 98, 52 88, 62 76 L 68 68 C 76 58, 84 52, 92 52 C 100 52, 106 58, 106 66"
          stroke="url(#infinityGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Right Loop (Sunset Amber / Gold) & Interlocking Cross */}
        <path
          d="M 68 98 C 80 98, 90 90, 90 80 C 90 70, 80 62, 68 62 C 56 62, 46 72, 36 84 L 32 90 C 24 98, 16 98, 10 90"
          stroke="url(#infinityGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* 2. Soft Shadow on ribbon under isometric cube */}
        <ellipse cx="50" cy="62" rx="22" ry="7" fill="url(#cubeShadow)" />

        {/* 3. 3D Isometric Storage Cube */}
        <g id="isometric-cube" transform="translate(0, -6)">
          {/* Top Diamond Face */}
          <path
            d="M 50 12 L 76 27 L 50 42 L 24 27 Z"
            fill="url(#cubeTop)"
            stroke="#0A0D0F"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Left Vertical Face */}
          <path
            d="M 24 27 L 50 42 L 50 72 L 24 57 Z"
            fill="url(#cubeLeft)"
            stroke="#0A0D0F"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Right Vertical Face */}
          <path
            d="M 50 42 L 76 27 L 76 57 L 50 72 Z"
            fill="url(#cubeRight)"
            stroke="#0A0D0F"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Isometric Inner Box Lines */}
          <path
            d="M 50 42 L 50 72 M 50 42 L 24 27 M 50 42 L 76 27"
            stroke="#0A0D0F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* ── Official Crisp Solid White Wordmark ── */}
      {showWordmark && (
        <span
          className={`font-extrabold tracking-tight text-white ${
            textClassName || "text-xl sm:text-2xl"
          }`}
          style={{ letterSpacing: "-0.03em" }}
        >
          StashSaarthi
        </span>
      )}
    </div>
  );
}
