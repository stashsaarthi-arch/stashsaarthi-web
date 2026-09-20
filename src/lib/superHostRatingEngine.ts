/**
 * StashSaarthi Autonomous System — SuperHost Rating & Tiering Engine
 * 
 * CPO Directive (Task 121)
 * Evaluates host performance metrics, enforcing strict criteria for "SuperHost" badge accreditation:
 *  - ≥ 99.0% Check-in SLA Accuracy
 *  - Zero (0) Unresolved Property/Student Disputes
 *  - ≥ 4.8 / 5.0 Average Student Rating
 *  - Minimum 10 completed storage/co-living check-ins
 */

export type HostTierType = "Standard" | "Verified Host" | "SuperHost" | "Master SuperHost";

export interface HostMetrics {
  hostId: string;
  hostName: string;
  phone?: string;
  nodeAddress: string;
  campusNode: string;
  totalCheckIns: number;
  successfulCheckIns: number;
  totalDisputes: number;
  resolvedDisputes: number;
  averageRating: number;
  onTimePayoutPercentage: number;
  lastAuditDate?: string;
}

export interface HostEvaluationResult {
  hostId: string;
  hostName: string;
  tier: HostTierType;
  superHostBadgeGranted: boolean;
  checkInAccuracyPercentage: number;
  disputeFree: boolean;
  score: number; // 0-100 score
  qualifiesCriteria: {
    checkInAccuracyPass: boolean;
    zeroDisputePass: boolean;
    ratingPass: boolean;
    volumePass: boolean;
  };
  missingRequirementsEn: string[];
  missingRequirementsHi: string[];
  badgePerksEn: string[];
  badgePerksHi: string[];
  badgeIssuedDate: string;
}

const LOCAL_STORAGE_METRICS_KEY = "ss_host_metrics_records";

export const DEFAULT_HOST_METRICS: HostMetrics[] = [
  {
    hostId: "HOST-001",
    hostName: "Mrs. Sarita Sharma",
    phone: "+91 9839012345",
    nodeAddress: "117/N/89 Kakadeo, Kanpur",
    campusNode: "Kakadeo Coaching Belt",
    totalCheckIns: 48,
    successfulCheckIns: 48, // 100% check-in accuracy
    totalDisputes: 0, // 0 disputes
    resolvedDisputes: 0,
    averageRating: 4.95,
    onTimePayoutPercentage: 100,
    lastAuditDate: "2026-09-01",
  },
  {
    hostId: "HOST-002",
    hostName: "Er. Ramesh Verma",
    phone: "+91 9415098765",
    nodeAddress: "Nankari Gate 1, IIT Kanpur Belt",
    campusNode: "IIT Kanpur Gate 1",
    totalCheckIns: 32,
    successfulCheckIns: 32, // 100% accuracy
    totalDisputes: 0,
    resolvedDisputes: 0,
    averageRating: 4.88,
    onTimePayoutPercentage: 100,
    lastAuditDate: "2026-08-28",
  },
  {
    hostId: "HOST-003",
    hostName: "Shri Alok Tripathi",
    phone: "+91 9335011223",
    nodeAddress: "CSJMU Kalyanpur Road, Kanpur",
    campusNode: "CSJMU Kalyanpur",
    totalCheckIns: 15,
    successfulCheckIns: 14, // 93.3% check-in accuracy (<99%)
    totalDisputes: 1, // 1 dispute (>0)
    resolvedDisputes: 1,
    averageRating: 4.65,
    onTimePayoutPercentage: 95,
    lastAuditDate: "2026-08-15",
  },
];

/**
 * Evaluates host performance metrics and determines SuperHost status & tier.
 */
export function evaluateHostTier(metrics: HostMetrics): HostEvaluationResult {
  const total = Math.max(1, metrics.totalCheckIns);
  const accuracy = (metrics.successfulCheckIns / total) * 100;
  const checkInAccuracyPercentage = Math.round(accuracy * 10) / 10;

  const checkInAccuracyPass = checkInAccuracyPercentage >= 99.0;
  const zeroDisputePass = metrics.totalDisputes === 0;
  const ratingPass = metrics.averageRating >= 4.8;
  const volumePass = metrics.totalCheckIns >= 10;

  const missingEn: string[] = [];
  const missingHi: string[] = [];

  if (!checkInAccuracyPass) {
    missingEn.push(`Check-in accuracy is ${checkInAccuracyPercentage}% (Min 99.0% required)`);
    missingHi.push(`चेक-इन सटीकता ${checkInAccuracyPercentage}% है (न्यूनतम 99.0% आवश्यक)`);
  }

  if (!zeroDisputePass) {
    missingEn.push(`Recorded ${metrics.totalDisputes} dispute(s) (Zero disputes required)`);
    missingHi.push(`${metrics.totalDisputes} विवाद दर्ज हैं (शून्य विवाद अनिवार्य)`);
  }

  if (!ratingPass) {
    missingEn.push(`Average rating is ${metrics.averageRating.toFixed(2)} / 5.0 (Min 4.8 required)`);
    missingHi.push(`औसत रेटिंग ${metrics.averageRating.toFixed(2)} / 5.0 है (न्यूनतम 4.8 आवश्यक)`);
  }

  if (!volumePass) {
    missingEn.push(`Completed ${metrics.totalCheckIns} check-ins (Min 10 required)`);
    missingHi.push(`कुल ${metrics.totalCheckIns} चेक-इन पूर्ण हुए हैं (न्यूनतम 10 आवश्यक)`);
  }

  const isSuperHost = checkInAccuracyPass && zeroDisputePass && ratingPass && volumePass;

  let tier: HostTierType = "Standard";
  if (isSuperHost) {
    tier = metrics.totalCheckIns >= 40 ? "Master SuperHost" : "SuperHost";
  } else if (metrics.totalCheckIns >= 5 && metrics.totalDisputes === 0) {
    tier = "Verified Host";
  }

  // Calculate composite score (0-100)
  const accuracyWeight = (checkInAccuracyPercentage / 100) * 40; // 40 pts
  const disputeWeight = zeroDisputePass ? 30 : 0; // 30 pts
  const ratingWeight = (metrics.averageRating / 5.0) * 20; // 20 pts
  const volumeWeight = Math.min(10, (metrics.totalCheckIns / 30) * 10); // 10 pts
  const score = Math.round(accuracyWeight + disputeWeight + ratingWeight + volumeWeight);

  const perksEn = isSuperHost
    ? [
        "⭐ #1 Top Search Placement on StashSaarthi Campus Map",
        "⚡ 1.2x Higher Student Booking Conversion Rate",
        "🏆 Official Golden SuperHost Shield Badge & Certificate",
        "💸 Instant Priority Razorpay Payout Routing (Zero-Delay)",
      ]
    : [
        "Verified Verified PG Owner Host Badge",
        "Standard Razorpay Route Payout Schedule",
      ];

  const perksHi = isSuperHost
    ? [
        "⭐ स्टैशसारथी कैंपस मैप पर शीर्ष #1 सर्च स्थान",
        "⚡ 1.2x अधिक छात्र बुकिंग रूपांतरण दर",
        "🏆 आधिकारिक स्वर्णिम सुपरहोस्ट शील्ड बैज व प्रमाणपत्र",
        "💸 त्वरित प्राथमिकता रेज़रपे भुगतान (शून्य-देरी)",
      ]
    : [
        "सत्यापित वरिष्ठ होस्ट बैज",
        "मानक रेज़रपे रूट भुगतान अनुसूची",
      ];

  return {
    hostId: metrics.hostId,
    hostName: metrics.hostName,
    tier,
    superHostBadgeGranted: isSuperHost,
    checkInAccuracyPercentage,
    disputeFree: zeroDisputePass,
    score,
    qualifiesCriteria: {
      checkInAccuracyPass,
      zeroDisputePass,
      ratingPass,
      volumePass,
    },
    missingRequirementsEn: missingEn,
    missingRequirementsHi: missingHi,
    badgePerksEn: perksEn,
    badgePerksHi: perksHi,
    badgeIssuedDate: new Date().toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
  };
}

/**
 * Saves host metrics into localStorage.
 */
export function saveHostMetricsRecord(record: HostMetrics): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllHostMetrics();
    const updated = [record, ...all.filter((m) => m.hostId !== record.hostId)];
    localStorage.setItem(LOCAL_STORAGE_METRICS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to save host metrics to localStorage:", err);
  }
}

/**
 * Gets all host metrics records.
 */
export function getAllHostMetrics(): HostMetrics[] {
  if (typeof window === "undefined") return DEFAULT_HOST_METRICS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_METRICS_KEY);
    if (!raw) return DEFAULT_HOST_METRICS;
    return JSON.parse(raw) as HostMetrics[];
  } catch (err) {
    console.warn("Failed to parse host metrics from localStorage:", err);
    return DEFAULT_HOST_METRICS;
  }
}

/**
 * Evaluates all hosts and returns leaderboard array sorted by composite score.
 */
export function getHostLeaderboard(): HostEvaluationResult[] {
  const metrics = getAllHostMetrics();
  return metrics
    .map(evaluateHostTier)
    .sort((a, b) => b.score - a.score);
}
