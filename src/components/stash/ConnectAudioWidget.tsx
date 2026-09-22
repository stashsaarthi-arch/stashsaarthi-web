import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Mic,
  Volume2,
  Wifi,
  Radio,
  Zap,
  Activity,
  CheckCircle2,
  Play,
  Square,
  ShieldCheck,
  Signal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  NetworkTier,
  NETWORK_PROFILES,
  detectNetworkTier,
  playCompressedVoicePreview,
  AudioCompressorTelemetry,
  calculateMOS,
} from "@/lib/connectAudioEngine";
import { playClick } from "@/lib/audio";

export function ConnectAudioWidget() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [tier, setTier] = useState<NetworkTier>("2G_CSJMU");
  const [isPlaying, setIsPlaying] = useState(false);
  const [telemetry, setTelemetry] = useState<AudioCompressorTelemetry | null>(null);
  const [waveHeight, setWaveHeight] = useState<number[]>([15, 40, 75, 50, 90, 60, 30, 80, 45, 20]);

  // Auto-detect client network tier on mount
  useEffect(() => {
    const detected = detectNetworkTier();
    setTier(detected);
    setTelemetry({
      tier: detected,
      rawBytes: 172800,
      compressedBytes: 13500,
      compressionRatio: NETWORK_PROFILES[detected].compressionRatioPercent,
      bitrateKbps: NETWORK_PROFILES[detected].bitrateKbps,
      latencyMs: NETWORK_PROFILES[detected].expectedLatencyMs,
      mosScore: calculateMOS(
        NETWORK_PROFILES[detected].bitrateKbps,
        NETWORK_PROFILES[detected].expectedLatencyMs,
      ),
      vadActive: NETWORK_PROFILES[detected].vadEnabled,
      timestamp: Date.now(),
    });
  }, []);

  // Audio wave animation loop when playing
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlaying) {
      setWaveHeight([15, 30, 45, 30, 60, 40, 25, 50, 35, 20, 15, 10]);
      return;
    }
    const interval = setInterval(() => {
      setWaveHeight(Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 15));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTestCall = async (targetTier: NetworkTier) => {
    playClick();
    setTier(targetTier);
    setIsPlaying(true);
    try {
      const res = await playCompressedVoicePreview(targetTier, 2.2);
      setTelemetry(res);
    } finally {
      setIsPlaying(false);
    }
  };

  const profile = NETWORK_PROFILES[tier];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-black/50 p-4 sm:p-5 backdrop-blur-md text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {isHi
                  ? "सारथी कनेक्ट: 2G/3G लो-लेटेन्सी वॉइस इंजन"
                  : "Saarthi Connect: 2G/3G Low-Latency Voice Engine"}
              </h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                12 kbps Opus
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isHi
                ? "CSJMU हॉस्टल एवं काकादेव की कमजोर 2G/3G नेटवर्क बेल्ट पर भी स्पष्ट और बिना रुकावट वाली आवाज़"
                : "Crystal-clear voice calls optimized for weak 2G/3G cellular networks near CSJMU & Kakadeo"}
            </p>
          </div>
        </div>

        {/* Dynamic MOS Score Badge */}
        {telemetry && (
          <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block leading-none">Voice MOS Score</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {telemetry.mosScore} / 5.0
              </span>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Network Tier Selector Pills */}
      <div className="mt-4">
        <label className="text-[11px] font-bold text-slate-300 block mb-2">
          {isHi
            ? "नेटवर्क प्रोफाइल चुनें (Network Bandwidth Profile)"
            : "Select Network Bandwidth Profile"}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(NETWORK_PROFILES) as NetworkTier[]).map((tKey) => {
            const p = NETWORK_PROFILES[tKey];
            const isSelected = tier === tKey;
            return (
              <button
                key={tKey}
                type="button"
                onClick={() => handleTestCall(tKey)}
                disabled={isPlaying}
                className={`rounded-xl border p-2.5 text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-cyan-400/60 bg-cyan-500/15 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Signal
                      className={`h-3.5 w-3.5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`}
                    />
                    {isHi ? p.labelHi : p.label}
                  </span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-cyan-300 font-semibold">
                    {p.bitrateKbps} kbps
                  </span>
                  <span className="text-slate-400 font-mono">~{p.expectedLatencyMs}ms lat</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Waveform Visualizer & Test Trigger */}
      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="hero"
            size="sm"
            onClick={() => handleTestCall(tier)}
            disabled={isPlaying}
            className="shrink-0 cursor-pointer text-xs py-2 px-4 gap-2 font-bold"
          >
            {isPlaying ? (
              <>
                <Square className="h-3.5 w-3.5 animate-pulse text-amber-400 fill-amber-400" />
                <span>{isHi ? "ऑडियो चल रहा है..." : "Playing 2G Voice..."}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isHi ? "2G टेस्ट कॉल सुनें" : "Test Voice Call"}</span>
              </>
            )}
          </Button>

          {/* Animated Audio Frequency Bars */}
          <div className="flex items-end gap-1 h-8 px-2 py-1 bg-black/60 rounded-lg border border-white/10 flex-1 sm:w-36 justify-center">
            {waveHeight.map((h, idx) => (
              <motion.span
                key={idx}
                animate={{ height: isPlaying ? `${h}%` : "15%" }}
                transition={{ duration: 0.12 }}
                className={`w-1 rounded-full ${
                  isPlaying ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-right w-full sm:w-auto text-[11px] text-slate-300">
          <div className="flex items-center justify-end gap-1.5 font-semibold text-cyan-300">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>{isHi ? profile.descriptionHi : profile.description}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Breakdown Grid */}
      {telemetry && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <span className="text-[10px] text-slate-400 block">
              {isHi ? "डाटा बचत (Data Saved)" : "Data Saved"}
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {telemetry.compressionRatio}%
            </span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <span className="text-[10px] text-slate-400 block">
              {isHi ? "कॉल लेटेन्सी" : "Call Latency"}
            </span>
            <span className="text-sm font-bold text-cyan-400 font-mono">
              {telemetry.latencyMs} ms
            </span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <span className="text-[10px] text-slate-400 block">
              {isHi ? "ऑडियो कोडैक" : "Audio Codec"}
            </span>
            <span className="text-[11px] font-bold text-slate-200 truncate block">
              {profile.codec.split(" ")[0]}
            </span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2">
            <span className="text-[10px] text-slate-400 block">
              {isHi ? "VAD साइलेंस कट" : "VAD Silence Gate"}
            </span>
            <span className="text-xs font-bold text-amber-400">
              {telemetry.vadActive ? (isHi ? "सक्रिय (Enabled)" : "Active") : "Off"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
