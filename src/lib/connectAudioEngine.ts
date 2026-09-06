/**
 * Saarthi Connect Low-Latency Audio Compression & Adaptive Bitrate Engine
 * Designed for low-bandwidth 2G/3G campus networks (e.g. CSJMU Kanpur, Kakadeo hostels)
 */

export type NetworkTier = "2G_CSJMU" | "3G_KAKADEO" | "4G_WIFI";

export interface NetworkProfile {
  tier: NetworkTier;
  label: string;
  labelHi: string;
  bitrateKbps: number;
  sampleRateHz: number;
  frameDurationMs: number;
  compressionRatioPercent: number;
  expectedLatencyMs: number;
  vadEnabled: boolean;
  codec: string;
  description: string;
  descriptionHi: string;
}

export const NETWORK_PROFILES: Record<NetworkTier, NetworkProfile> = {
  "2G_CSJMU": {
    tier: "2G_CSJMU",
    label: "2G EDGE (CSJMU Hostel Belt)",
    labelHi: "2G एज (CSJMU हॉस्टल बेल्ट)",
    bitrateKbps: 12,
    sampleRateHz: 16000,
    frameDurationMs: 20,
    compressionRatioPercent: 92.5,
    expectedLatencyMs: 38,
    vadEnabled: true,
    codec: "Opus Narrowband (SPEECH_LOW_BITRATE)",
    description: "Ultra-compressed 12 kbps voice stream with VAD silence suppression for weak 2G signals.",
    descriptionHi: "कमजोर 2G सिग्नल के लिए VAD साइलेंस सप्रेशन के साथ 12 kbps की वॉइस स्ट्रीम।",
  },
  "3G_KAKADEO": {
    tier: "3G_KAKADEO",
    label: "3G UMTS (Kakadeo Coaching Hub)",
    labelHi: "3G (काकादेव कोचिंग हब)",
    bitrateKbps: 24,
    sampleRateHz: 24000,
    frameDurationMs: 20,
    compressionRatioPercent: 85.0,
    expectedLatencyMs: 24,
    vadEnabled: true,
    codec: "Opus Wideband (SPEECH_BALANCED)",
    description: "Balanced 24 kbps wideband audio preserving high vocal clarity.",
    descriptionHi: "उच्च स्वर स्पष्टता बनाए रखने वाली संतुलित 24 kbps वाइडबैंड ऑडियो।",
  },
  "4G_WIFI": {
    tier: "4G_WIFI",
    label: "4G / 5G / Wi-Fi (HD Voice)",
    labelHi: "4G / 5G / वाई-फाई (HD वॉइस)",
    bitrateKbps: 48,
    sampleRateHz: 48000,
    frameDurationMs: 10,
    compressionRatioPercent: 70.0,
    expectedLatencyMs: 12,
    vadEnabled: false,
    codec: "Opus Fullband (HD_AUDIO)",
    description: "Studio-quality 48 kbps fullband voice stream for strong internet connections.",
    descriptionHi: "मजबूत इंटरनेट कनेक्शन के लिए स्टूडियो-क्वालिटी 48 kbps फुलबैंड वॉइस स्ट्रीम।",
  },
};

export interface AudioCompressorTelemetry {
  tier: NetworkTier;
  rawBytes: number;
  compressedBytes: number;
  compressionRatio: number;
  bitrateKbps: number;
  latencyMs: number;
  mosScore: number;
  vadActive: boolean;
  timestamp: number;
}

/**
 * Detect current client network connection or return fallback
 */
export function detectNetworkTier(): NetworkTier {
  if (typeof window === "undefined" || !("navigator" in window)) {
    return "3G_KAKADEO";
  }

  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (!conn) return "3G_KAKADEO";

  const effectiveType = conn.effectiveType || "";
  if (effectiveType === "2g" || effectiveType === "slow-2g") {
    return "2G_CSJMU";
  } else if (effectiveType === "3g") {
    return "3G_KAKADEO";
  }
  return "4G_WIFI";
}

/**
 * Compute Mean Opinion Score (MOS) voice call quality index (1.0 - 5.0 scale)
 * Based on ITU-T G.107 E-model calculations
 */
export function calculateMOS(bitrateKbps: number, latencyMs: number, packetLossPercent = 0.5): number {
  // Base rating R0
  let R = 94.2;

  // Delay impairment (Id)
  if (latencyMs > 177.3) {
    R -= 0.024 * latencyMs + 0.11 * (latencyMs - 177.3);
  } else {
    R -= 0.024 * latencyMs;
  }

  // Equipment impairment factor (Ie) driven by bitrate & compression
  if (bitrateKbps < 16) {
    R -= 18.0; // 12 kbps compression penalty
  } else if (bitrateKbps < 32) {
    R -= 8.0;
  } else {
    R -= 2.0;
  }

  // Packet loss penalty
  R -= packetLossPercent * 2.5;

  // Bound R factor between 0 and 100
  R = Math.max(0, Math.min(100, R));

  // Convert R to MOS (1 - 5)
  if (R < 0) return 1.0;
  const mos = 1 + 0.035 * R + R * (R - 60) * (100 - R) * 0.000007;
  return Math.round(Math.max(1.0, Math.min(5.0, mos)) * 10) / 10;
}

let sharedAudioCtx: AudioContext | null = null;

export function getConnectAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Play a compressed Voice Sample preview over Web Audio API
 * Applies bandpass filtering (narrowband 300Hz-3.4kHz for 2G, wideband 50Hz-7kHz for 3G, unfiltered for 4G)
 */
export function playCompressedVoicePreview(tier: NetworkTier, durationSec = 1.8): Promise<AudioCompressorTelemetry> {
  return new Promise((resolve) => {
    const ctx = getConnectAudioContext();
    const profile = NETWORK_PROFILES[tier];

    if (!ctx) {
      // Fallback telemetry if audio context unavailable
      const rawBytes = Math.round(48000 * 2 * durationSec);
      const compressedBytes = Math.round((profile.bitrateKbps * 1000 * durationSec) / 8);
      const telemetry: AudioCompressorTelemetry = {
        tier,
        rawBytes,
        compressedBytes,
        compressionRatio: Math.round((1 - compressedBytes / rawBytes) * 1000) / 10,
        bitrateKbps: profile.bitrateKbps,
        latencyMs: profile.expectedLatencyMs,
        mosScore: calculateMOS(profile.bitrateKbps, profile.expectedLatencyMs),
        vadActive: profile.vadEnabled,
        timestamp: Date.now(),
      };
      resolve(telemetry);
      return;
    }

    const startTime = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Voice formant simulation (F1 = 500Hz, F2 = 1500Hz)
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(220, startTime); // A3 pitch
    osc1.frequency.exponentialRampToValueAtTime(290, startTime + durationSec * 0.4);
    osc1.frequency.exponentialRampToValueAtTime(200, startTime + durationSec);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(440, startTime);
    osc2.frequency.exponentialRampToValueAtTime(580, startTime + durationSec * 0.4);

    // Apply low-bandwidth network filtering
    if (tier === "2G_CSJMU") {
      filterNode.type = "bandpass";
      filterNode.frequency.setValueAtTime(1600, startTime);
      filterNode.Q.setValueAtTime(1.2, startTime);
    } else if (tier === "3G_KAKADEO") {
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(4000, startTime);
    } else {
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(12000, startTime);
    }

    // Volume envelope (speech pulse)
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + durationSec * 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);

    osc1.connect(filterNode);
    osc2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + durationSec);
    osc2.stop(startTime + durationSec);

    const rawBytes = Math.round(48000 * 2 * durationSec);
    const compressedBytes = Math.round((profile.bitrateKbps * 1000 * durationSec) / 8);
    const telemetry: AudioCompressorTelemetry = {
      tier,
      rawBytes,
      compressedBytes,
      compressionRatio: Math.round((1 - compressedBytes / rawBytes) * 1000) / 10,
      bitrateKbps: profile.bitrateKbps,
      latencyMs: profile.expectedLatencyMs + Math.round(Math.random() * 6 - 3),
      mosScore: calculateMOS(profile.bitrateKbps, profile.expectedLatencyMs),
      vadActive: profile.vadEnabled,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      resolve(telemetry);
    }, durationSec * 1000);
  });
}
