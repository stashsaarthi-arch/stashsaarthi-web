import {
  generateTpaDigitalStampAgreement,
  saveTpaDigitalAgreement,
  getTpaDigitalAgreements,
  getLatestTpaAgreementForHost,
  verifyTpaStampHash,
  generateTpaVerificationHash,
} from "../src/lib/tpaDigitalAgreementEngine.ts";

console.log("=== StashSaarthi Autonomous System: TPA Sec 105 Digital Agreement Test Suite ===");

// Test 1: Generate Digital e-Stamp Agreement
const sampleHost = {
  name: "Mrs. Pushpa Devi",
  phone: "+91 9415098765",
  address: "117/N/45 Kakadeo Coaching Belt, Kanpur",
  campus: "Kakadeo Coaching Belt",
};

console.log("Generating dynamic TPA Sec 105 e-Stamp Certificate...");
const record = generateTpaDigitalStampAgreement(
  sampleHost.name,
  sampleHost.phone,
  sampleHost.address,
  sampleHost.campus,
);

console.log("✔ Agreement Generated:");
console.log(`  - Agreement ID: ${record.agreementId}`);
console.log(`  - Stamp Certificate No: ${record.stampCertificateNo}`);
console.log(`  - GRN No: ${record.grnNo}`);
console.log(`  - Issued State: ${record.issuedState}`);
console.log(`  - Stamp Duty Paid: ₹${record.stampDutyAmount}`);
console.log(
  `  - Second Party (Host): ${record.secondPartyHostName} (${record.secondPartyHostPhone})`,
);
console.log(`  - SHA-256 Verification Hash: ${record.verificationHash}`);
console.log(`  - Total Clauses: ${record.clauses.length}`);

// Test 2: Cryptographic Verification Seal Check
const isValid = verifyTpaStampHash(record);
console.log(`\n✔ Seal Hash Verification: ${isValid ? "PASSED (AUTHENTIC SEAL)" : "FAILED"}`);

if (!isValid) {
  console.error("❌ ERROR: Hash verification failed on generated record!");
  process.exit(1);
}

// Test 3: Verify Clauses Structure
if (record.clauses.length < 5) {
  console.error(`❌ ERROR: Expected at least 5 TPA clauses, found ${record.clauses.length}`);
  process.exit(1);
}
console.log("✔ Verified 5-point TPA Sec 105 legal protections structure.");

console.log("\n=== Task 119 Verification Completed Successfully ===");
