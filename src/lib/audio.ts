import { WEB_AUDIO_SOUNDSCAPE_TOKENS } from "./designTokens";

// Ultra-low latency Web Audio API based micro-haptics/clicks

let audioCtx: AudioContext | null = null;
let audioUnlockedByUser = false; // Gate: only play after genuine user gesture
let audioMuted = false; // Global mute toggle

// Unlock audio on first genuine user gesture (click, touchstart, keydown)
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    audioUnlockedByUser = true;
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("click", unlockAudio, { once: false, passive: true });
  window.addEventListener("touchstart", unlockAudio, { once: false, passive: true });
  window.addEventListener("keydown", unlockAudio, { once: false, passive: true });
}

/** Toggle global audio mute */
export const setAudioMuted = (muted: boolean) => { audioMuted = muted; };
export const isAudioMuted = (): boolean => audioMuted;

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  // Don't play if muted or page is hidden or user hasn't interacted yet
  if (audioMuted || document.hidden || !audioUnlockedByUser) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isWebAudioSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};

export const playClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Subtle short click sound
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
};

export const playPop = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // Satisfying pop sound (useful for toggles)
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
};

export const playHeroCtaClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  // High-frequency tactile sweep + metallic resonance for Hero CTA overdrive
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(900, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.03);
  osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(450, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.08);
  osc2.stop(ctx.currentTime + 0.08);
};

export const playPersonaSwitch = (targetRole: "student" | "host") => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (targetRole === "student") {
    // High-frequency bright chime sweep for Student Mint mode
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } else {
    // Warm low-mid resonant chime sweep for Host Amber mode
    osc.type = "triangle";
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }
};

/**
 * Play distinct pleasant audio feedback for toggle switch state transitions (ON / OFF)
 */
export const playToggleSwitch = (on: boolean) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const config = on ? WEB_AUDIO_SOUNDSCAPE_TOKENS.toggleSwitch.on : WEB_AUDIO_SOUNDSCAPE_TOKENS.toggleSwitch.off;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = config.waveform;
  osc.frequency.setValueAtTime(config.baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(config.targetFreq, ctx.currentTime + config.durationMs / 1000);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.durationMs / 1000);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + config.durationMs / 1000);
};

/**
 * Play cheerful ascending micro-pitch chime for item counter increments
 */
export const playCounterIncrement = (currentCount: number = 1) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const cfg = WEB_AUDIO_SOUNDSCAPE_TOKENS.counterIncrement;
  const targetPitch = Math.min(cfg.maxPitchHz, cfg.baseFreq + Math.max(0, currentCount - 1) * cfg.pitchStepHz);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = cfg.waveform;
  osc.frequency.setValueAtTime(cfg.baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(targetPitch, ctx.currentTime + cfg.durationMs / 1000);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(cfg.volume, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.durationMs / 1000);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + cfg.durationMs / 1000);
};

/**
 * Play subtle descending tick sound for item counter decrements
 */
export const playCounterDecrement = (currentCount: number = 1) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const cfg = WEB_AUDIO_SOUNDSCAPE_TOKENS.counterDecrement;
  const startPitch = Math.max(cfg.minPitchHz, cfg.baseFreq - Math.max(0, currentCount - 1) * cfg.pitchStepHz);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = cfg.waveform;
  osc.frequency.setValueAtTime(startPitch, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(cfg.minPitchHz, ctx.currentTime + cfg.durationMs / 1000);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(cfg.volume, ctx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.durationMs / 1000);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + cfg.durationMs / 1000);
};

/**
 * Play rich 4-note major chord arpeggio for payment and booking confirmations
 */
export const playPaymentConfirmation = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const cfg = WEB_AUDIO_SOUNDSCAPE_TOKENS.paymentConfirmation;
  const now = ctx.currentTime;

  cfg.frequencies.forEach((freq, index) => {
    const startTime = now + (index * cfg.staggerMs) / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = cfg.waveform;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(cfg.volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + cfg.durationMs / 1000);

    osc.start(startTime);
    osc.stop(startTime + cfg.durationMs / 1000);
  });
};

/**
 * Play pleasant 3-note success chime
 */
export const playSuccessChime = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const cfg = WEB_AUDIO_SOUNDSCAPE_TOKENS.successChime;
  const now = ctx.currentTime;

  cfg.frequencies.forEach((freq, index) => {
    const startTime = now + (index * cfg.staggerMs) / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = cfg.waveform;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(cfg.volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + cfg.durationMs / 1000);

    osc.start(startTime);
    osc.stop(startTime + cfg.durationMs / 1000);
  });
};

/**
 * Play warning/error double-beep sound
 */
export const playWarningBeep = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const cfg = WEB_AUDIO_SOUNDSCAPE_TOKENS.warningBeep;
  const now = ctx.currentTime;

  cfg.frequencies.forEach((freq, index) => {
    const startTime = now + (index * cfg.staggerMs) / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = cfg.waveform;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(cfg.volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + cfg.durationMs / 1000);

    osc.start(startTime);
    osc.stop(startTime + cfg.durationMs / 1000);
  });
};



