import { getBookings, type BookingRecord } from "./localSubmissions";

export interface StorageQrScanResult {
  isValid: boolean;
  tokenId: string;
  scannedRole: "student" | "host" | "admin";
  booking?: BookingRecord | undefined;
  custodyStatus: "CUSTODY_VERIFIED" | "ESCROW_LOCKED" | "NODE_DISPATCHED" | "UNKNOWN";
  verificationHash: string;
  scannedAt: string;
  roleActionText: string;
}

/**
 * Validates a scanned luggage storage QR Code token ID across Student, Host, and Admin roles.
 */
export function verifyStorageQrCode(
  tokenId: string,
  role: "student" | "host" | "admin" = "student"
): StorageQrScanResult {
  const cleanToken = tokenId.trim().toUpperCase();
  const allBookings = getBookings();
  const foundBooking = allBookings.find((b) => b.token.toUpperCase() === cleanToken);

  const scannedAt = new Date().toISOString();
  const verificationHash = `#SEAL-KNP-${cleanToken.replace(/[^0-[#]/g, "").slice(0, 6) || "9821"}`;

  if (!foundBooking) {
    return {
      isValid: cleanToken.startsWith("ST-"),
      tokenId: cleanToken,
      scannedRole: role,
      custodyStatus: cleanToken.startsWith("ST-") ? "ESCROW_LOCKED" : "UNKNOWN",
      verificationHash,
      scannedAt,
      roleActionText:
        role === "student"
          ? "View Student Digital Custody Pass"
          : role === "host"
          ? "Verify Senior Host Node Intake"
          : "Audit Operational Escrow & Itemization Log",
    };
  }

  const roleActionText =
    role === "student"
      ? `Student ${foundBooking.name} verified active storage reservation (${foundBooking.bags || 1} bags).`
      : role === "host"
      ? `Senior Host Node verified physical intake of ${foundBooking.bags || 1} luggage items.`
      : `Admin Operations audited Escrow UPI ₹${foundBooking.amount} and barcode custody logs.`;

  return {
    isValid: true,
    tokenId: cleanToken,
    scannedRole: role,
    booking: foundBooking,
    custodyStatus: "CUSTODY_VERIFIED",
    verificationHash,
    scannedAt,
    roleActionText,
  };
}

/**
 * Generates the official QR code data URL for a given booking token ID.
 */
export function getStorageQrCodeUrl(tokenId: string, size = 180): string {
  const cleanToken = encodeURIComponent(tokenId.trim().toUpperCase());
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=4&color=000000&bgcolor=ffffff&data=${cleanToken}`;
}
