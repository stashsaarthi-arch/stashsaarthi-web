// Ultra-low latency Web Audio API based synthetic micro-haptics / audio architecture
// Generates subtle ~10ms oscillator micro-clicks with zero external audio assets

let audioCtx: AudioContext | null = null;
let hasUserInteracted = false;

// Audio is opt-in/opt-out with safe local storage persistence
export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("ss_audio_feedback");
    // Defaults to true once user interacts, unless explicitly disabled
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("ss_audio_feedback", String(enabled));
  } catch {}
};

export const toggleSound = (): boolean => {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  if (next) {
    playMicroClick();
  }
  return next;
};

// Safe AudioContext getter that prevents browser autoplay policy warnings
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!isSoundEnabled()) return null;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    hasUserInteracted = true;
    return audioCtx;
  } catch {
    return null;
  }
};

/**
 * 1. playMicroClick: Ultra-short ~10ms high-precision micro-click
 * Perfect for rapid item clicks, counter +/- buttons, and small interactive nodes.
 */
export const playMicroClick = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.012);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

    osc.start(now);
    osc.stop(now + 0.012);
  } catch {}
};

/**
 * 2. playTab: Subtle physical detent tick (~12ms)
 * Triggered on switching tabs between Stash, Spaces, Kitchen, and Connect.
 */
export const playTab = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.015);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch {}
};

/**
 * 3. playToggle: Dual-pitch shift sound (~20ms)
 * Triggered when toggling fulfillment (Self-Pickup vs Room Delivery) or meal customization.
 */
export const playToggle = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.02);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch {}
};

/**
 * 4. playConfirm: Warm harmonic chime (~120ms)
 * Triggered on successful booking confirmation, verification, or receipt copy.
 */
export const playConfirm = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Dual harmonic oscillator for rich, warm confirmation tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.06); // E5

    osc2.frequency.setValueAtTime(783.99, now); // G5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.06); // C6

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.12);
    osc2.stop(now + 0.12);
  } catch {}
};

/**
 * Standard click (maintained for backward compatibility)
 */
export const playClick = () => {
  playMicroClick();
};

/**
 * Standard pop (maintained for backward compatibility)
 */
export const playPop = () => {
  playToggle();
};
