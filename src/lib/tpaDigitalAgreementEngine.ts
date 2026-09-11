/**
 * StashSaarthi Autonomous System — TPA Sec 105 Digital Stamp Agreement Engine
 * 
 * CSO Compliance Directive (Task 119)
 * Automated dynamic digital stamp agreement generator under Transfer of Property Act (TPA) 1882, Section 105
 * Governs permissive Leave & License rights between Host Nodes and StashSaarthi Platform.
 */

export interface TpaAgreementClause {
  clauseNumber: number;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
}

export interface TpaDigitalAgreementRecord {
  agreementId: string;
  stampCertificateNo: string;
  grnNo: string;
  issuedState: string;
  stampDutyAmount: number;
  firstParty: string;
  secondPartyHostName: string;
  secondPartyHostPhone: string;
  nodeAddress: string;
  campusNode: string;
  effectiveDate: string;
  validityMonths: number;
  verificationHash: string;
  digitalSignatureSeal: string;
  timestamp: string;
  clauses: TpaAgreementClause[];
}

export const TPA_SEC_105_DEFAULT_CLAUSES: TpaAgreementClause[] = [
  {
    clauseNumber: 1,
    titleEn: "Grant of Permissive Leave & License (TPA 1882, Sec 105)",
    titleHi: "अनुमेय लीव एंड लाइसेंस का अनुदान (TPA 1882, धारा 105)",
    contentEn: "The Host grants purely permissive, non-exclusive, non-transferable Leave & License to StashSaarthi to utilize specified micro-storage space / student room. This agreement creates NO tenancy, leasehold, or property right in favor of StashSaarthi or students. Absolute property title remains with the Host.",
    contentHi: "होस्ट स्टैशसारथी को निर्दिष्ट माइक्रो-स्टोरेज स्पेस/छात्र कमरे के उपयोग के लिए विशुद्ध रूप से अनुमेय, गैर-विशेष लीव एंड लाइसेंस प्रदान करता है। यह समझौता स्टैशसारथी या छात्रों के पक्ष में कोई किरायेदारी या पट्टा अधिकार नहीं बनाता है। पूर्ण संपत्ति मालिकाना हक होस्ट के पास रहेगा।",
  },
  {
    clauseNumber: 2,
    titleEn: "Zero-Brokerage & Automated 24-Hour Payout SLA",
    titleHi: "शून्य दलाली व स्वचालित 24-घंटे भुगतान SLA",
    contentEn: "Host receives 100% agreed net earnings (0% host commission fee). Payouts are automatically processed via Razorpay Route split payment gateway within 24 hours of booking completion directly into Host bank/UPI.",
    contentHi: "होस्ट को 100% सहमत शुद्ध आय (0% होस्ट कमीशन) प्राप्त होती है। रेज़रपे रूट स्प्लिट पेमेंट गेटवे के माध्यम से बुकिंग पूरी होने के 24 घंटे के भीतर बैंक/UPI में स्वचालित भुगतान किया जाता है।",
  },
  {
    clauseNumber: 3,
    titleEn: "₹10,000 Micro-Insurance & Property Protection",
    titleHi: "₹10,000 माइक्रो-इंश्योरेंस व संपत्ति सुरक्षा",
    contentEn: "StashSaarthi provides an embedded safety policy covering up to ₹10,000 for accidental property damage occurring during student custody or storage operations, subject to verification.",
    contentHi: "स्टैशसारथी छात्र प्रवास या भंडारण संचालन के दौरान होने वाले आकस्मिक संपत्ति नुकसान के लिए ₹10,000 तक का सुरक्षा कवर प्रदान करता है।",
  },
  {
    clauseNumber: 4,
    titleEn: "24/7 Bedside SOS & Student Conduct Rules",
    titleHi: "24/7 बेडसाइड SOS व छात्र आचरण नियम",
    contentEn: "Students must adhere to strict quiet hours (10:00 PM to 6:00 AM) and campus norms. Host is backed by 24/7 Bedside SOS hotline (+91 9369454350) with 15-minute Kanpur ground ops emergency response SLA.",
    contentHi: "छात्रों को शांत घंटों (रात 10:00 बजे से सुबह 6:00 बजे) और परिसर नियमों का पालन करना होगा। 15-मिनट कानपुर ग्राउंड सपोर्ट SLA के साथ 24/7 बेडसाइड SOS हॉटलाइन (+91 9369454350) उपलब्ध है।",
  },
  {
    clauseNumber: 5,
    titleEn: "Revocation at Will & 24-Hour Relocation Guarantee",
    titleHi: "इच्छानुसार निरस्तीकरण व 24-घंटे रीलोकेशन गारंटी",
    contentEn: "Either party may terminate this license with a 24-hour notice. In case of student conduct breach, StashSaarthi guarantees immediate student relocation within 24 hours with zero financial loss to Host.",
    contentHi: "कोई भी पक्ष 24 घंटे के नोटिस के साथ इस लाइसेंस को समाप्त कर सकता है। छात्र आचरण उल्लंघन के मामले में, स्टैशसारथी होस्ट को बिना वित्तीय नुकसान के 24 घंटे के भीतर छात्र रीलोकेशन की गारंटी देता है।",
  },
];

const LOCAL_STORAGE_KEY = "ss_tpa_digital_agreements";

/**
 * Generates a deterministic dynamic SHA-256 verification hash simulation for e-Stamp authenticity.
 */
export function generateTpaVerificationHash(
  stampNo: string,
  hostName: string,
  hostPhone: string,
  timestamp: string
): string {
  const payload = `${stampNo}:${hostName}:${hostPhone}:${timestamp}:TPA-105-UP-STAMP-2026`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, "0");
  const hex2 = Math.abs(hash * 31).toString(16).padStart(8, "0");
  const hex3 = Math.abs(hash * 127).toString(16).padStart(8, "0");
  const hex4 = Math.abs(hash * 8191).toString(16).padStart(8, "0");
  return `0x${hex1}${hex2}${hex3}${hex4}`.toUpperCase();
}

/**
 * Creates and signs a new dynamic digital e-Stamp agreement for a host onboarding.
 */
export function generateTpaDigitalStampAgreement(
  secondPartyHostName: string,
  secondPartyHostPhone: string,
  nodeAddress: string,
  campusNode: string = "Kakadeo Coaching Belt"
): TpaDigitalAgreementRecord {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const grnRand = Math.floor(1000000 + Math.random() * 9000000);
  const timestamp = new Date().toISOString();

  const stampCertificateNo = `IN-UP2026STAMP-${randNum}`;
  const grnNo = `GRN-UP2026-${grnRand}`;
  const agreementId = `TPA-105-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const verificationHash = generateTpaVerificationHash(
    stampCertificateNo,
    secondPartyHostName,
    secondPartyHostPhone,
    timestamp
  );

  const record: TpaDigitalAgreementRecord = {
    agreementId,
    stampCertificateNo,
    grnNo,
    issuedState: "Uttar Pradesh",
    stampDutyAmount: 100,
    firstParty: "StashSaarthi Platform Technologies Pvt Ltd (Advik Omer, Founder)",
    secondPartyHostName,
    secondPartyHostPhone,
    nodeAddress,
    campusNode,
    effectiveDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    validityMonths: 11,
    verificationHash,
    digitalSignatureSeal: `DIGITAL-SEAL-UP-STAMP-${agreementId}`,
    timestamp,
    clauses: TPA_SEC_105_DEFAULT_CLAUSES,
  };

  saveTpaDigitalAgreement(record);
  return record;
}

/**
 * Saves agreement record to localStorage.
 */
export function saveTpaDigitalAgreement(record: TpaDigitalAgreementRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getTpaDigitalAgreements();
    const updated = [record, ...existing.filter((r) => r.agreementId !== record.agreementId)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to save TPA digital agreement to localStorage:", err);
  }
}

/**
 * Retrieves all stored TPA agreements.
 */
export function getTpaDigitalAgreements(): TpaDigitalAgreementRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TpaDigitalAgreementRecord[];
  } catch (err) {
    console.warn("Failed to parse TPA digital agreements from localStorage:", err);
    return [];
  }
}

/**
 * Gets the latest agreement for a given host phone or returns the most recent one.
 */
export function getLatestTpaAgreementForHost(hostPhone?: string): TpaDigitalAgreementRecord | null {
  const agreements = getTpaDigitalAgreements();
  if (agreements.length === 0) return null;
  if (hostPhone) {
    const match = agreements.find((a) => a.secondPartyHostPhone === hostPhone);
    if (match) return match;
  }
  return agreements[0] || null;
}

/**
 * Verifies authenticity hash of a TPA digital agreement.
 */
export function verifyTpaStampHash(record: TpaDigitalAgreementRecord): boolean {
  if (!record || !record.verificationHash || !record.stampCertificateNo) return false;
  const expectedHash = generateTpaVerificationHash(
    record.stampCertificateNo,
    record.secondPartyHostName,
    record.secondPartyHostPhone,
    record.timestamp
  );
  return record.verificationHash === expectedHash;
}
