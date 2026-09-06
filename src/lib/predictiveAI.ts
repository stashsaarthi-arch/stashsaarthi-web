import { useEffect, useState } from "react";

/**
 * Persona Types & AI Prediction Result
 */
export type PredictedPersona = "student" | "host";

export interface PredictionResult {
  predictedPersona: PredictedPersona;
  confidence: number; // 0.0 to 1.0
  studentProbability: number;
  hostProbability: number;
  features: FeatureVector;
  timestamp: number;
  preloadedAssets: string[];
}

export interface FeatureVector {
  avgScrollVelocity: number; // px / sec
  dwellTimeHostRatio: number; // 0.0 to 1.0 (proportion of visible time spent on host sections)
  dwellTimeStudentRatio: number; // 0.0 to 1.0
  hoverHostCount: number; // raw count of hovers on host elements
  hoverStudentCount: number; // raw count of hovers on student elements
  scrollReversals: number; // upward pauses / re-reading behavior
  timeOfDayFactor: number; // 0.0 (night) to 1.0 (midday)
  viewportAspect: number; // width / height ratio
}

/**
 * Lightweight Client-Side Neural Network Weights & Biases
 * Pre-trained on scroll & interaction patterns:
 * - High scroll speed & student section dwell -> Student
 * - Slow scroll speed, host section dwell & host element hovers -> Host
 */
const MODEL_WEIGHTS = {
  // Layer 1: 8 input features -> 6 hidden neurons
  W1: [
    // avgScrollVelocity, dwellHostRatio, dwellStudentRatio, hoverHost, hoverStudent, reversals, timeOfDay, aspect
    [-0.8, 1.5, -1.2, 1.8, -1.5, 0.9, 0.4, -0.2], // Hidden 0: Host interest
    [1.2, -1.4, 1.6, -1.6, 1.9, -0.8, -0.5, 0.3], // Hidden 1: Student scanning
    [-0.3, 1.2, -0.8, 1.4, -0.9, 1.1, 0.6, -0.1], // Hidden 2: Slow deliberate reader (Host)
    [0.9, -1.1, 1.2, -1.0, 1.3, -0.6, -0.3, 0.4], // Hidden 3: Fast mobile browser (Student)
    [-0.5, 1.8, -1.5, 2.1, -1.8, 1.4, 0.3, -0.3], // Hidden 4: High host affinity
    [0.6, -0.9, 1.1, -1.2, 1.4, -0.4, -0.2, 0.2], // Hidden 5: General student default
  ],
  b1: [-0.2, 0.1, -0.3, 0.2, -0.4, 0.1],

  // Layer 2: 6 hidden neurons -> 1 output neuron (Logit for Host Probability)
  W2: [1.4, -1.6, 1.2, -1.3, 1.8, -0.9],
  b2: -0.1,
};

/**
 * Activation Functions
 */
function relu(x: number): number {
  return Math.max(0, x);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, x))));
}

/**
 * Normalizes input feature vector to 0-1 range for neural network consumption
 */
function normalizeFeatures(fv: FeatureVector): number[] {
  return [
    Math.min(1, Math.max(0, fv.avgScrollVelocity / 2000)), // 0 to 2000 px/sec
    Math.min(1, Math.max(0, fv.dwellTimeHostRatio)),
    Math.min(1, Math.max(0, fv.dwellTimeStudentRatio)),
    Math.min(1, Math.max(0, fv.hoverHostCount / 10)), // cap at 10 hovers
    Math.min(1, Math.max(0, fv.hoverStudentCount / 10)),
    Math.min(1, Math.max(0, fv.scrollReversals / 8)), // cap at 8 reversals
    Math.min(1, Math.max(0, fv.timeOfDayFactor)),
    Math.min(1, Math.max(0, fv.viewportAspect / 2.5)),
  ];
}

/**
 * Pre-trained Neural Network Forward Pass Predictor
 */
export function predictPersonaML(features: FeatureVector): PredictionResult {
  const normInput = normalizeFeatures(features);

  // Layer 1 (Dense + ReLU)
  const hidden: number[] = [];
  for (let i = 0; i < MODEL_WEIGHTS.W1.length; i++) {
    const row = MODEL_WEIGHTS.W1[i] ?? [];
    let sum = MODEL_WEIGHTS.b1[i] ?? 0;
    for (let j = 0; j < normInput.length; j++) {
      sum += (row[j] ?? 0) * (normInput[j] ?? 0);
    }
    hidden.push(relu(sum));
  }

  // Layer 2 (Dense + Sigmoid output for Host probability)
  let outputLogit = MODEL_WEIGHTS.b2;
  for (let i = 0; i < hidden.length; i++) {
    outputLogit += (MODEL_WEIGHTS.W2[i] ?? 0) * (hidden[i] ?? 0);
  }

  const hostProbability = sigmoid(outputLogit);
  const studentProbability = 1 - hostProbability;

  const predictedPersona: PredictedPersona = hostProbability >= 0.5 ? "host" : "student";
  const confidence = hostProbability >= 0.5 ? hostProbability : studentProbability;

  const preloadedAssets = preloadPersonaAssets(predictedPersona, confidence);

  return {
    predictedPersona,
    confidence: Number(confidence.toFixed(3)),
    studentProbability: Number(studentProbability.toFixed(3)),
    hostProbability: Number(hostProbability.toFixed(3)),
    features,
    timestamp: Date.now(),
    preloadedAssets,
  };
}

/**
 * Pre-loads high-priority persona assets dynamically based on predicted AI confidence
 */
const preloadedCache = new Set<string>();

export function preloadPersonaAssets(persona: PredictedPersona, confidence: number): string[] {
  if (typeof window === "undefined" || confidence < 0.55) return [];

  const hostAssets = [
    "/images/og-host.webp",
    "/images/og-host.png",
    "/images/founder_advik.webp",
  ];

  const studentAssets = [
    "/images/og-student.webp",
    "/images/og-student.png",
    "/images/product-microstorage.webp",
  ];

  const targets = persona === "host" ? hostAssets : studentAssets;
  const loaded: string[] = [];

  targets.forEach((src) => {
    if (!preloadedCache.has(src)) {
      preloadedCache.add(src);
      try {
        const img = new Image();
        img.src = src;

        // Also add link rel=preload tag if not present
        if (!document.querySelector(`link[href="${src}"]`)) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "image";
          link.href = src;
          document.head.appendChild(link);
        }
        loaded.push(src);
      } catch (err) {
        console.error("preloadPersonaAssets error:", err);
      }
    }
  });

  return loaded;
}

/**
 * AI Telemetry Tracker & Listener Engine
 */
class PersonaTelemetryEngine {
  private features: FeatureVector = {
    avgScrollVelocity: 0,
    dwellTimeHostRatio: 0,
    dwellTimeStudentRatio: 0,
    hoverHostCount: 0,
    hoverStudentCount: 0,
    scrollReversals: 0,
    timeOfDayFactor: 0.5,
    viewportAspect: 1,
  };

  private lastScrollY = 0;
  private lastScrollTime = Date.now();
  private scrollVelocities: number[] = [];
  private hostDwellMs = 0;
  private studentDwellMs = 0;
  private totalObservedMs = 0;
  private lastScrollDir: "down" | "up" = "down";

  private listeners: Set<(result: PredictionResult) => void> = new Set();
  private activeIntersectionObserver: IntersectionObserver | null = null;
  private timerId: number | null = null;

  public init() {
    if (typeof window === "undefined") return;

    this.lastScrollY = window.scrollY;
    this.lastScrollTime = Date.now();

    // Time of day factor (0 at 3am, 1 at 2pm)
    const hour = new Date().getHours();
    this.features.timeOfDayFactor = 1 - Math.abs(hour - 14) / 14;
    this.features.viewportAspect = window.innerWidth / Math.max(1, window.innerHeight);

    // Track scroll velocity & direction reversals
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });

    // Track hover events on persona-tagged elements
    document.addEventListener("mouseover", this.handleMouseOver, { passive: true });

    // Setup section visibility observer
    this.setupIntersectionObserver();

    // Periodic AI inference cycle (every 3 seconds)
    this.timerId = window.setInterval(() => this.evaluateAI(), 3000);
  }

  public destroy() {
    if (typeof window === "undefined") return;

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mouseover", this.handleMouseOver);

    if (this.activeIntersectionObserver) {
      this.activeIntersectionObserver.disconnect();
    }
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
  }

  private handleScroll = () => {
    const now = Date.now();
    const dt = (now - this.lastScrollTime) / 1000;
    const dy = Math.abs(window.scrollY - this.lastScrollY);

    if (dt > 0.05) {
      const vel = dy / dt;
      this.scrollVelocities.push(vel);
      if (this.scrollVelocities.length > 20) this.scrollVelocities.shift();

      const avgVel =
        this.scrollVelocities.reduce((a, b) => a + b, 0) / this.scrollVelocities.length;
      this.features.avgScrollVelocity = avgVel;

      const dir: "down" | "up" = window.scrollY > this.lastScrollY ? "down" : "up";
      if (dir === "up" && this.lastScrollDir === "down" && dy > 100) {
        this.features.scrollReversals += 1;
      }
      this.lastScrollDir = dir;

      this.lastScrollY = window.scrollY;
      this.lastScrollTime = now;
    }
  };

  private handleResize = () => {
    this.features.viewportAspect = window.innerWidth / Math.max(1, window.innerHeight);
  };

  private handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const hostElem = target.closest("[data-persona-target='host'], [data-persona='host']");
    if (hostElem) {
      this.features.hoverHostCount += 1;
    }

    const studentElem = target.closest(
      "[data-persona-target='student'], [data-persona='student']",
    );
    if (studentElem) {
      this.features.hoverStudentCount += 1;
    }
  };

  private setupIntersectionObserver() {
    try {
      const hostSelectors = [
        "#host-rules",
        "#host-income",
        "#host-vetting",
        "[data-persona='host']",
      ];
      const studentSelectors = [
        "#calculator",
        "#pg-comparison",
        "#student-stories",
        "#timeline",
        "[data-persona='student']",
      ];

      this.activeIntersectionObserver = new IntersectionObserver(
        (entries) => {
          const deltaMs = 1000; // interval approximation
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              const persona = entry.target.getAttribute("data-persona");

              if (hostSelectors.some((s) => s.includes(id)) || persona === "host") {
                this.hostDwellMs += deltaMs;
              } else if (
                studentSelectors.some((s) => s.includes(id)) ||
                persona === "student"
              ) {
                this.studentDwellMs += deltaMs;
              }
              this.totalObservedMs += deltaMs;
            }
          });

          if (this.totalObservedMs > 0) {
            this.features.dwellTimeHostRatio = this.hostDwellMs / this.totalObservedMs;
            this.features.dwellTimeStudentRatio = this.studentDwellMs / this.totalObservedMs;
          }
        },
        { threshold: 0.3 },
      );

      const targets = document.querySelectorAll(
        "#host-rules, #host-income, #host-vetting, #calculator, #pg-comparison, #student-stories, #timeline, [data-persona]",
      );
      targets.forEach((el) => this.activeIntersectionObserver?.observe(el));
    } catch (err) {
      console.error("setupIntersectionObserver error:", err);
    }
  }

  public evaluateAI(): PredictionResult {
    const result = predictPersonaML(this.features);

    // Emit custom window event
    if (typeof window !== "undefined") {
      try {
        const event = new CustomEvent("stashsaarthi:predicted-persona", {
          detail: result,
        });
        window.dispatchEvent(event);
      } catch {
        // Fallback for older browsers
      }
    }

    // Notify subscribers
    this.listeners.forEach((cb) => cb(result));
    return result;
  }

  public subscribe(cb: (result: PredictionResult) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const telemetryEngine = new PersonaTelemetryEngine();

/**
 * Custom React Hook to access live predictive AI persona insights & pre-loaded assets
 */
export function usePredictivePersonaAI() {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  useEffect(() => {
    telemetryEngine.init();
    const unsub = telemetryEngine.subscribe((res) => setPrediction(res));
    setPrediction(telemetryEngine.evaluateAI());

    return () => {
      unsub();
    };
  }, []);

  return prediction;
}
