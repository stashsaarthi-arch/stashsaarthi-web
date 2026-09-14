import React, { memo, useState } from "react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { playPop, playSuccessChime, playClick } from "@/lib/audio";
import { isLowDataModeEnabled } from "@/context/LowDataContext";
import {
  LASER_BARCODE_SEAL_TOKENS,
  getLaserBarcodeSealTokens,
} from "@/lib/designTokens";

export interface LaserSealBarcodeProps {
  serialCode?: string;
  verifiedTimestamp?: string;
  size?: "sm" | "md" | "lg";
  showSecurityBadge?: boolean;
  showScanButton?: boolean;
  interactive?: boolean;
  className?: string;
  onVerify?: (serialCode: string) => void;
}

export const LaserSealBarcode = memo(function LaserSealBarcode({
  serialCode = LASER_BARCODE_SEAL_TOKENS.defaultSerialCode,
  verifiedTimestamp = "2026-ACTIVE-SEAL",
  size = "md",
  showSecurityBadge = true,
  showScanButton = true,
  interactive = true,
  className = "",
  onVerify,
}: LaserSealBarcodeProps) {
  const personaContext = usePersona();
  const persona = personaContext?.role || "student";
  const { language } = useLanguage();
  const isHi = language === "hi";
  const isHost = persona === "host";
  const lowData = isLowDataModeEnabled();

  const [isScanning, setIsScanning] = useState(false);
  const [scanVerified, setScanVerified] = useState(true);

  const tokens = getLaserBarcodeSealTokens(persona);

  const handleReScan = () => {
    if (!interactive || isScanning) return;
    setIsScanning(true);
    try {
      playClick();
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanVerified(true);
      try {
        playSuccessChime();
      } catch {
        playPop();
      }
      if (onVerify) {
        onVerify(serialCode);
      }
    }, 1200);
  };

  // Dimensions based on size prop
  const containerDimensions = {
    sm: "px-3 py-2 min-h-[70px]",
    md: "px-4 py-3 min-h-[90px]",
    lg: "px-6 py-4 min-h-[110px]",
  }[size];

  const barcodeHeight = {
    sm: 32,
    md: 44,
    lg: 56,
  }[size];

  const accentColor = tokens.glowColor;
  const beamClass = isHost ? "laser-seal-beam-host" : "laser-seal-beam-student";
  const glowClass = isHost ? "laser-seal-glow-host" : "laser-seal-glow-student";

  // Pre-calculated barcode line patterns (width & opacity)
  const barcodeLines = [
    { w: 3, o: 1 }, { w: 1, o: 0.8 }, { w: 4, o: 1 }, { w: 2, o: 0.9 },
    { w: 1, o: 0.7 }, { w: 5, o: 1 }, { w: 2, o: 0.85 }, { w: 1, o: 0.6 },
    { w: 3, o: 1 }, { w: 2, o: 0.9 }, { w: 1, o: 0.75 }, { w: 4, o: 1 },
    { w: 2, o: 0.8 }, { w: 1, o: 0.5 }, { w: 3, o: 1 }, { w: 2, o: 0.95 },
    { w: 4, o: 1 }, { w: 1, o: 0.7 }, { w: 2, o: 0.85 }, { w: 3, o: 1 },
    { w: 1, o: 0.9 }, { w: 5, o: 1 }, { w: 2, o: 0.8 }, { w: 1, o: 0.6 },
    { w: 3, o: 1 }, { w: 4, o: 1 }, { w: 2, o: 0.9 }, { w: 1, o: 0.75 },
  ];

  return (
    <div
      className={`laser-barcode-seal-container relative overflow-hidden rounded-xl border transition-all duration-300 ${glowClass} ${containerDimensions} ${className}`}
      data-persona={persona}
      data-serial={serialCode}
      role="region"
      aria-label={isHi ? "लेजर सील बारकोड सुरक्षा" : "Laser Seal Barcode Security"}
    >
      {/* Laser Sweeping Beam */}
      {!lowData && (
        <div
          className={`laser-barcode-beam ${beamClass} ${
            isScanning ? "animate-pulse scale-110" : ""
          }`}
          style={{
            height: "100%",
            transition: isScanning ? "left 0.3s ease" : undefined,
          }}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Left Side: Header & Serial Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                isHost
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {isScanning ? (
                <span className="animate-spin text-base">⚡</span>
              ) : (
                <span className="text-base">🛡️</span>
              )}
            </div>
            {scanVerified && !isScanning && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isHost ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isHost ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isHi ? "लेजर सील एंटी-टैम्पर" : "Laser Seal Anti-Tamper"}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                  isHost
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {isScanning
                  ? isHi
                    ? "स्कैनिंग..."
                    : "SCANNING..."
                  : isHi
                  ? "सत्यापित सील"
                  : "SEAL INTACT"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{serialCode}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{verifiedTimestamp}</span>
            </p>
          </div>
        </div>

        {/* Center/Right: SVG Barcode Display */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={handleReScan}>
            <svg
              width="180"
              height={barcodeHeight}
              viewBox={`0 0 180 ${barcodeHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`barcode-lines-svg ${
                !lowData ? "barcode-lines-glow-active" : ""
              }`}
              aria-hidden="true"
            >
              <rect width="180" height={barcodeHeight} fill="none" />
              {barcodeLines.map((line, idx) => {
                const xPos = idx * 6.2 + 4;
                return (
                  <rect
                    key={idx}
                    x={xPos}
                    y="4"
                    width={line.w}
                    height={barcodeHeight - 8}
                    fill={accentColor}
                    opacity={line.o}
                    rx="0.5"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[1px] rounded">
              <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                {isHi ? "सत्यापित करने के लिए टैप करें" : "TAP TO VERIFY"}
              </span>
            </div>
          </div>

          {/* Verification CTA Button */}
          {showScanButton && (
            <button
              type="button"
              onClick={handleReScan}
              disabled={isScanning}
              className={`hidden md:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                isHost
                  ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 hover:border-amber-500/50"
                  : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50"
              }`}
            >
              <span>{isScanning ? "⏳" : "🔍"}</span>
              <span>
                {isScanning
                  ? isHi
                    ? "जाँच जारी..."
                    : "Verifying..."
                  : isHi
                  ? "सीलिंग जांचें"
                  : "Verify Seal"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Security Badges */}
      {showSecurityBadge && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <span className={isHost ? "text-amber-400" : "text-emerald-400"}>
                ✓
              </span>{" "}
              {isHi ? "TPA धारा 105 सुरक्षा" : "TPA Sec 105 Security"}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className={isHost ? "text-amber-400" : "text-emerald-400"}>
                ✓
              </span>{" "}
              {isHi ? "₹10,000 माइक्रो-बीमा" : "₹10k Micro-Insurance Covered"}
            </span>
          </div>
          <span className="font-mono text-slate-500">
            {isHi ? "डिजिटल एंटी-टैम्पर 2.0" : "Digital Tamper-Proof v2.0"}
          </span>
        </div>
      )}
    </div>
  );
});
