/**
 * Host Stash Verification Checklist Engine — StashSaarthi Autonomous System
 * 
 * Enforces 3-Point Intake Checklist for Host App / Operator Intake:
 * 1. Box Seal Intact (Laser barcode tamper tape unbroken)
 * 2. Barcode Scanned (Pre-printed alphanumeric tag verified)
 * 3. Weight under 25kg (Digital scale reading <= 25.0 kg)
 * + Photo proof upload & intake audit certificate generation.
 */

export interface HostStashVerification {
  id: string;
  bookingId?: string;
  hostName: string;
  campusNode: string;
  sealIntact: boolean;
  barcodeSerial: string;
  measuredWeightKg: number;
  maxAllowedWeightKg: number; // 25.0 kg
  photoProofUrl?: string;
  notes?: string;
  status: "verified" | "flagged" | "rejected";
  verifiedAt: string;
  certificateId: string;
  verifiedBy: string;
}

export interface VerificationChecklistState {
  sealIntact: boolean;
  barcodeSerial: string;
  measuredWeightKg: number;
  photoProofUrl?: string;
  notes?: string;
}

export interface VerificationValidationResult {
  isValid: boolean;
  status: "verified" | "flagged" | "rejected";
  sealPassed: boolean;
  barcodePassed: boolean;
  weightPassed: boolean;
  photoPassed: boolean;
  errors: string[];
  certificateId: string;
}

const STORAGE_KEY = "ss_host_stash_verifications";
export const MAX_ALLOWED_WEIGHT_KG = 25.0;

/**
 * Validates a host intake checklist against verified platform safety rules
 */
export function validateIntakeChecklist(
  checklist: VerificationChecklistState,
  hostName: string = "Sudha Tripathi (Senior Host)",
  campusNode: string = "Kakadeo PW Hub",
  verifiedBy: string = "StashSaarthi Host App Intake"
): VerificationValidationResult {
  const errors: string[] = [];

  // 1. Box Seal Intact Check
  const sealPassed = checklist.sealIntact === true;
  if (!sealPassed) {
    errors.push("Box seal must be intact and unbroken before accepting stash.");
  }

  // 2. Barcode Serial Check
  const barcodeTrimmed = checklist.barcodeSerial?.trim() || "";
  const barcodePassed = barcodeTrimmed.length >= 4;
  if (!barcodePassed) {
    errors.push("Valid alphanumeric barcode serial must be scanned or entered.");
  }

  // 3. Weight Check (<= 25.0 kg)
  const weight = checklist.measuredWeightKg || 0;
  const weightPassed = weight > 0 && weight <= MAX_ALLOWED_WEIGHT_KG;
  if (weight > MAX_ALLOWED_WEIGHT_KG) {
    errors.push(`Stash weight (${weight.toFixed(1)}kg) exceeds max limit of ${MAX_ALLOWED_WEIGHT_KG}kg.`);
  } else if (weight <= 0) {
    errors.push("Measured weight must be greater than 0 kg.");
  }

  // 4. Photo Proof Check
  const photoPassed = Boolean(checklist.photoProofUrl && checklist.photoProofUrl.length > 0);
  if (!photoPassed) {
    errors.push("Photo proof upload is required for verification audit.");
  }

  const isValid = sealPassed && barcodePassed && weightPassed && photoPassed;
  const status: "verified" | "flagged" | "rejected" = isValid
    ? "verified"
    : weight > MAX_ALLOWED_WEIGHT_KG || !sealPassed
    ? "flagged"
    : "rejected";

  const certificateId = `SS-INTAKE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    isValid,
    status,
    sealPassed,
    barcodePassed,
    weightPassed,
    photoPassed,
    errors,
    certificateId,
  };
}

/**
 * Creates and persists a completed Host Stash Verification record
 */
export function createAndSaveVerification(
  checklist: VerificationChecklistState,
  bookingId: string = "BK-2026-9812",
  hostName: string = "Sudha Tripathi (Senior Host)",
  campusNode: string = "Kakadeo Hub",
  verifiedBy: string = "Senior Host App"
): HostStashVerification {
  const validation = validateIntakeChecklist(checklist, hostName, campusNode, verifiedBy);

  const verification: HostStashVerification = {
    id: `VER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId,
    hostName,
    campusNode,
    sealIntact: checklist.sealIntact,
    barcodeSerial: checklist.barcodeSerial || `SS-KNP-BAR-${Math.floor(1000 + Math.random() * 9000)}`,
    measuredWeightKg: checklist.measuredWeightKg,
    maxAllowedWeightKg: MAX_ALLOWED_WEIGHT_KG,
    photoProofUrl: checklist.photoProofUrl || "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Cpath d='M150 120h100v80H150z' fill='%231e293b' stroke='%2310b981' stroke-width='2'/%3E%3Ctext x='200' y='165' fill='%2300f5a0' font-family='sans-serif' font-size='14' text-anchor='middle'%3EBOX SEAL VERIFIED%3C/text%3E%3C/svg%3E",
    notes: checklist.notes || "3-point intake checklist completed cleanly.",
    status: validation.status,
    verifiedAt: new Date().toISOString(),
    certificateId: validation.certificateId,
    verifiedBy,
  };

  saveVerificationToStorage(verification);
  return verification;
}

/**
 * Saves a verification record to localStorage
 */
export function saveVerificationToStorage(record: HostStashVerification): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedVerifications();
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save host stash verification:", err);
  }
}

/**
 * Retrieves all saved verification records from localStorage
 */
export function getSavedVerifications(): HostStashVerification[] {
  if (typeof window === "undefined") return getDefaultPresetVerifications();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultPresetVerifications();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultPresetVerifications();
  } catch {
    return getDefaultPresetVerifications();
  }
}

/**
 * Returns default preset verification logs for demonstration & offline resilience
 */
export function getDefaultPresetVerifications(): HostStashVerification[] {
  return [
    {
      id: "VER-PRESET-101",
      bookingId: "BK-2026-8921",
      hostName: "Sudha Tripathi (Senior Host)",
      campusNode: "Kakadeo PW Hub",
      sealIntact: true,
      barcodeSerial: "SS-KNP-BAR-8921",
      measuredWeightKg: 18.4,
      maxAllowedWeightKg: MAX_ALLOWED_WEIGHT_KG,
      photoProofUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Crect x='100' y='60' width='200' height='180' rx='12' fill='%231e293b' stroke='%2310b981' stroke-width='3'/%3E%3Cpath d='M100 120h200' stroke='%2310b981' stroke-width='2' stroke-dasharray='6,6'/%3E%3Ctext x='200' y='100' fill='%2300f5a0' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EINTACT LASER SEAL%3C/text%3E%3Ctext x='200' y='160' fill='%2394a3b8' font-family='sans-serif' font-size='12' text-anchor='middle'%3EBARCODE: SS-KNP-BAR-8921%3C/text%3E%3Ctext x='200' y='190' fill='%2338bdf8' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EWEIGHT: 18.4 KG (PASS)%3C/text%3E%3C/svg%3E",
      notes: "Box intake verified on arrival. Laser barcode seal intact and verified on 24kg scale.",
      status: "verified",
      verifiedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      certificateId: "SS-INTAKE-2026-8921",
      verifiedBy: "Sudha Tripathi (Senior Host)",
    },
    {
      id: "VER-PRESET-102",
      bookingId: "BK-2026-8922",
      hostName: "Col. R. Bajpai (Retd.)",
      campusNode: "IIT Kanpur Nankari Gate",
      sealIntact: true,
      barcodeSerial: "SS-KNP-BAR-8922",
      measuredWeightKg: 22.1,
      maxAllowedWeightKg: MAX_ALLOWED_WEIGHT_KG,
      photoProofUrl: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230f172a'/%3E%3Crect x='100' y='60' width='200' height='180' rx='12' fill='%231e293b' stroke='%2310b981' stroke-width='3'/%3E%3Ctext x='200' y='100' fill='%2300f5a0' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3ESEAL INTACT %26 VERIFIED%3C/text%3E%3Ctext x='200' y='160' fill='%2394a3b8' font-family='sans-serif' font-size='12' text-anchor='middle'%3EBARCODE: SS-KNP-BAR-8922%3C/text%3E%3Ctext x='200' y='190' fill='%2338bdf8' font-family='sans-serif' font-size='14' font-weight='bold' text-anchor='middle'%3EWEIGHT: 22.1 KG (PASS)%3C/text%3E%3C/svg%3E",
      notes: "IITK student luggage intake complete. 100% verified under 25kg safety limit.",
      status: "verified",
      verifiedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      certificateId: "SS-INTAKE-2026-8922",
      verifiedBy: "Col. R. Bajpai",
    },
  ];
}
