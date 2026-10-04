const fs = require('fs');

// 1. DeliveryFleetScannerModal
let delivery = fs.readFileSync('src/components/stash/DeliveryFleetScannerModal.tsx', 'utf8');
delivery = delivery.replace(
  /export interface RunnerTask \{[\s\S]*?\}/,
  `export interface RunnerTask {
  id: string;
  bookingId: string;
  type: "PICKUP" | "DROPOFF";
  status: "PENDING" | "IN_TRANSIT" | "ARRIVED" | "COMPLETED" | "assigned" | "en_route" | "scanned_intake";
  studentName: string;
  hostName: string;
  campusNode: string;
  boxCount: number;
  studentPhone?: string;
  tamperSealBarcode?: string;
}`
);
delivery = delivery.replace(
  /const getRunnerStats = \(\) => \(\{ pendingCount: 0, completedCount: 0, distanceKm: 0 \}\);/,
  `const getRunnerStats = () => ({ pendingCount: 0, completedCount: 0, distanceKm: 0, completedDelivered: 0, pendingPickups: 0, avgSlaMins: 0 });`
);
fs.writeFileSync('src/components/stash/DeliveryFleetScannerModal.tsx', delivery);

// 2. RagChatbotWidget
let rag = fs.readFileSync('src/components/stash/RagChatbotWidget.tsx', 'utf8');
rag = rag.replace(
  /citations: Array<\{ title: string; url: string \}>;/,
  `citations: string[];`
);
fs.writeFileSync('src/components/stash/RagChatbotWidget.tsx', rag);

// 3. TamperHologramProtocolModal
let holo = fs.readFileSync('src/components/stash/TamperHologramProtocolModal.tsx', 'utf8');
holo = holo.replace(
  /export interface TamperHologramRecord \{[\s\S]*?auditTrail: Array<\{ timestamp: string; status: string; notes: string \}>;\n\}/,
  `export interface TamperHologramRecord {
  id: string;
  hologramCode: string;
  cryptoHash: string;
  linkedBookingId: string;
  hostName: string;
  campusNode: string;
  status: "INTACT" | "INSPECTED" | "TAMPERED" | "VOIDED";
  linkedBoxCount: number;
  issuedAt: string;
  scannedAt: string;
  scannedByAgentId: string;
  auditTrail: Array<{ timestamp: string; status: string; notes: string }>;
  bookingId?: string;
  studentName?: string;
  boxCount?: number;
  securitySealHash?: string;
}`
);
holo = holo.replace(
  /const getHologramStats = \(\) => \(\{ total: 0, intact: 0, tampered: 0, voided: 0 \}\);/,
  `const getHologramStats = () => ({ total: 0, intact: 0, tampered: 0, voided: 0, totalHolograms: 0, intactCount: 0, tamperedCount: 0, securityScore: 100 });`
);
holo = holo.replace(
  /const linkHologramToStashRecord = \(code: string, bookingId: string, hostName: string, campusNode: string, boxCount: number, agentId: string\)/,
  `const linkHologramToStashRecord = (code: string, bookingId: string, hostName: string, campusNode: string, boxCount: number, agentId: string, extra?: any)`
);
holo = holo.replace(
  /const recordHologramTamperCheck = \(code: string, status: string, notes: string\)/,
  `const recordHologramTamperCheck = (code: string, status: string, notes: string, extra?: any)`
);
fs.writeFileSync('src/components/stash/TamperHologramProtocolModal.tsx', holo);

// 4. HostStashVerificationModal
let host = fs.readFileSync('src/components/stash/HostStashVerificationModal.tsx', 'utf8');
host = host.replace(
  /export interface HostStashVerification \{[\s\S]*?geoFenceResult\?: GeoFenceResult;\n\}/,
  `export interface HostStashVerification {
  id: string;
  bookingId?: string;
  hostName: string;
  campusNode: string;
  sealIntact: boolean;
  barcodeSerial: string;
  measuredWeightKg: number;
  maxAllowedWeightKg: number;
  photoProofUrl?: string;
  notes?: string;
  timestamp: string;
  isValid: boolean;
  rejectionReason?: string;
  geoFencePassed?: boolean;
  geoFenceDistanceMeters?: number;
  geoFenceResult?: GeoFenceResult;
  certificateId?: string;
  status?: string;
}`
);
host = host.replace(
  /const validateIntakeChecklist = \(state: VerificationChecklistState, geo: boolean\) => \(\{ isValid: true, rejectionReason: "" \}\);/,
  `const validateIntakeChecklist = (state: VerificationChecklistState, geo: any, extra?: any) => ({ isValid: true, rejectionReason: "", geoFencePassed: true, sealPassed: true, barcodePassed: true, errors: [] });`
);
host = host.replace(
  /const createAndSaveVerification = async \(payload: any\) => \{/,
  `const createAndSaveVerification = async (state: any, bookingId?: any, hostName?: any, campusNode?: any) => {`
);
host = host.replace(
  /const record = await createAndSaveVerification\(\{ state, bookingId, hostName, campusNode \}\);/,
  `const record = await createAndSaveVerification(state, bookingId, hostName, campusNode);`
);
fs.writeFileSync('src/components/stash/HostStashVerificationModal.tsx', host);
