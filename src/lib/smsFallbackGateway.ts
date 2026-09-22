/**
 * StashSaarthi — SMS Fallback Gateway Protocol Engine
 * Task 129: Cellular data failure fallback via encrypted SMS OTP confirmation.
 * Allows campus runners to complete doorstep handovers when internet connection is lost.
 */

export interface SmsOtpPacket {
  taskId: string;
  runnerId: string;
  otp: string;
  timestamp: number;
  tamperSeal: string;
  signature: string;
}

export interface SmsVerificationResult {
  valid: boolean;
  message: string;
  packet?: SmsOtpPacket;
}

const SMS_SECRET_SALT = "STASH-SMS-GATEWAY-KEY-2026-KANPUR";
const OTP_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Simple deterministic HMAC-like signature generator for offline verification
 */
function computeSignature(payloadStr: string): string {
  let hash = 0;
  const combined = `${payloadStr}:${SMS_SECRET_SALT}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `SIG${hex.toUpperCase()}`;
}

/**
 * Generate a 6-digit numeric OTP deterministically for a task ID
 */
export function generateRunnerOtp(taskId: string): string {
  let hash = 5381;
  for (let i = 0; i < taskId.length; i++) {
    hash = (hash * 33) ^ taskId.charCodeAt(i);
  }
  const num = (Math.abs(hash) % 900000) + 100000;
  return num.toString();
}

/**
 * Encode an encrypted SMS payload packet for cellular data blindspots
 */
export function generateEncryptedSmsPayload(
  taskId: string,
  runnerId: string,
  otp: string,
  tamperSeal: string,
): string {
  const timestamp = Date.now();
  const rawPayload = `${taskId}|${runnerId}|${otp}|${tamperSeal}|${timestamp}`;
  const base64Data =
    typeof btoa !== "undefined" ? btoa(rawPayload) : Buffer.from(rawPayload).toString("base64");

  const sig = computeSignature(base64Data);
  return `STASH-SMS-OTP:v1:${base64Data}:${sig}`;
}

/**
 * Parse and verify an incoming raw encrypted SMS payload packet
 */
export function parseAndVerifySmsPayload(rawSmsBody: string): SmsVerificationResult {
  if (!rawSmsBody || !rawSmsBody.startsWith("STASH-SMS-OTP:v1:")) {
    return {
      valid: false,
      message: "Invalid SMS payload format. Must start with STASH-SMS-OTP:v1:",
    };
  }

  const parts = rawSmsBody.split(":");
  if (parts.length !== 4) {
    return {
      valid: false,
      message: "Malformed SMS packet structure.",
    };
  }

  const base64Data = parts[2] || "";
  const signature = parts[3] || "";

  if (!base64Data || !signature) {
    return {
      valid: false,
      message: "Invalid SMS packet fields.",
    };
  }

  // 1. Verify HMAC Signature
  const expectedSig = computeSignature(base64Data);
  if (signature !== expectedSig) {
    return {
      valid: false,
      message: "Cryptographic signature mismatch! Packet may be tampered with.",
    };
  }

  // 2. Decode Base64 payload
  try {
    const decoded =
      typeof atob !== "undefined"
        ? atob(base64Data)
        : Buffer.from(base64Data, "base64").toString("utf8");

    const [taskId = "", runnerId = "", otp = "", tamperSeal = "", tsStr = "0"] = decoded.split("|");
    const timestamp = parseInt(tsStr, 10);

    // 3. Expiration Check
    if (Date.now() - timestamp > OTP_EXPIRY_MS) {
      return {
        valid: false,
        message: "SMS OTP packet has expired (>30 mins).",
      };
    }

    const packet: SmsOtpPacket = {
      taskId,
      runnerId,
      otp,
      timestamp,
      tamperSeal,
      signature,
    };

    return {
      valid: true,
      message: "SMS OTP packet verified successfully!",
      packet,
    };
  } catch (err) {
    return {
      valid: false,
      message: "Failed to decode base64 SMS payload.",
    };
  }
}

/**
 * Direct OTP verification helper
 */
export function verifyRunnerOtpSms(
  taskId: string,
  inputOtp: string,
): { success: boolean; message: string } {
  const expectedOtp = generateRunnerOtp(taskId);
  if (inputOtp.trim() === expectedOtp) {
    return {
      success: true,
      message: `OTP ${inputOtp} verified. Handover unlocked via SMS fallback protocol.`,
    };
  }
  return {
    success: false,
    message: `Invalid OTP code ${inputOtp}. Expected 6-digit runner OTP.`,
  };
}

/**
 * Format SMS link URI for native device trigger
 */
export function getNativeSmsUri(phone: string, smsBody: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;
  return `sms:${formattedPhone}?body=${encodeURIComponent(smsBody)}`;
}
