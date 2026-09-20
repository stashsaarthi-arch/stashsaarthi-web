/**
 * StashSaarthi Autonomous System — Formal Host Vetting Process & Safety Agreement Policy
 * 
 * CEO & CSO Compliance Directive (Task 92)
 * Compliant with:
 *  - Transfer of Property Act (TPA) 1882, Section 105 (Leave & License Protection)
 *  - Digital Personal Data Protection (DPDP) Act 2023
 *  - Kanpur City Local Police Verification & Station Clearance Standards
 */

export interface HostPolicyTier {
  tierNumber: number;
  tierNameEn: string;
  tierNameHi: string;
  mandatoryRequirementsEn: string[];
  mandatoryRequirementsHi: string[];
  rejectionCriteriaEn: string;
  rejectionCriteriaHi: string;
}

export interface HostVettingPolicyCharter {
  version: string;
  effectiveDate: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  legalBasisEn: string[];
  legalBasisHi: string[];
  tiers: HostPolicyTier[];
  hostGuaranteesEn: string[];
  hostGuaranteesHi: string[];
}

export const OFFICIAL_HOST_VETTING_POLICY: HostVettingPolicyCharter = {
  version: "2.0-2026",
  effectiveDate: "September 1, 2026",
  titleEn: "StashSaarthi Official Host Vetting Process & Security Policy",
  titleHi: "स्टैशसारथी आधिकारिक होस्ट सत्यापन प्रक्रिया एवं सुरक्षा नीति",
  summaryEn: "This formal company policy governs the mandatory 4-tier onboarding, legal verification, physical safety auditing, and legal protection of all premium host host nodes operating within the StashSaarthi network in Kanpur.",
  summaryHi: "यह आधिकारिक कंपनी नीति कानपुर में स्टैशसारथी नेटवर्क के तहत संचालित सभी वरिष्ठ नागरिक होस्ट नोड्स के अनिवार्य 4-स्तरीय ऑनबोर्डिंग, कानूनी सत्यापन, भौतिक सुरक्षा ऑडिट और कानूनी सुरक्षा को नियंत्रित करती है।",
  legalBasisEn: [
    "Transfer of Property Act (TPA) 1882 Section 105 — Permissive Leave & License model (Zero tenancy or leasehold right transfer)",
    "Digital Personal Data Protection (DPDP) Act 2023 — Encrypted e-KYC & biometric identity processing",
    "Kanpur Police Station Character Verification Directive — Mandatory zero active FIR clearance",
    "StashSaarthi Intergenerational Safety Charter — 24/7 Bedside SOS & 15-minute Kanpur ground ops SLA",
  ],
  legalBasisHi: [
    "संपत्ति हस्तांतरण अधिनियम (TPA) 1882 धारा 105 — अनुमेय लीव एंड लाइसेंस मॉडल (शून्य किरायेदारी या पट्टा अधिकार हस्तांतरण)",
    "डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 — एन्क्रिप्टेड e-KYC व बायोमेट्रिक पहचान प्रसंस्करण",
    "कानपुर पुलिस स्टेशन चरित्र सत्यापन निर्देश — अनिवार्य शून्य सक्रिय प्राथमिकी (FIR) क्लीयरेंस",
    "स्टैशसारथी अंतर-पीढ़ी सुरक्षा चार्टर — 24/7 बेडसाइड SOS व 15-मिनट कानपुर ग्राउंड टीम सहायता SLA",
  ],
  tiers: [
    {
      tierNumber: 1,
      tierNameEn: "Tier 1: Biometric Identity & DigiLocker e-KYC",
      tierNameHi: "टियर 1: बायोमेट्रिक पहचान व डिजिलॉकर e-KYC",
      mandatoryRequirementsEn: [
        "Aadhaar biometric identity sync via DigiLocker e-KYC gateway",
        "Live camera facial liveness match against Aadhaar database photo (≥85% score)",
        "Property title deed or long-term registered lease documentation check",
      ],
      mandatoryRequirementsHi: [
        "डिजिलॉकर e-KYC गेटवे के माध्यम से आधार बायोमेट्रिक पहचान सिंक",
        "आधार फोटो के विरुद्ध लाइव कैमरा फेशियल मैच (≥85% स्कोर अनिवार्य)",
        "संपत्ति के मालिकाना हक या पंजीकृत दीर्घावधि लीज दस्तावेज जांच",
      ],
      rejectionCriteriaEn: "Mismatch in identity documents or facial similarity score below 85% results in permanent auto-rejection.",
      rejectionCriteriaHi: "पहचान पत्रों में असंगति या चेहरे के मिलान में 85% से कम स्कोर पर स्थायी स्वचालित अस्वीकृति।",
    },
    {
      tierNumber: 2,
      tierNameEn: "Tier 2: Police Station Character & Background Clearance",
      tierNameHi: "टियर 2: पुलिस स्टेशन चरित्र व पृष्ठभूमि क्लीयरेंस",
      mandatoryRequirementsEn: [
        "Submission of official Police Verification Certificate from registered local station",
        "Zero active FIR or criminal record declaration across city & state crime databases",
        "Signed legal indemnity waiver releasing host from unauthorized tenant claims",
      ],
      mandatoryRequirementsHi: [
        "पंजीकृत स्थानीय थाने से आधिकारिक पुलिस सत्यापन प्रमाणपत्र सबमिट करना",
        "शहर और राज्य अपराध डेटाबेस में शून्य सक्रिय एफआईआर या आपराधिक रिकॉर्ड घोषणा",
        "हस्ताक्षरित कानूनी क्षतिपूर्ति छूट जो होस्ट को अनधिकृत दावों से बचाती है",
      ],
      rejectionCriteriaEn: "Any recorded criminal offense or pending litigation results in instant lifetime platform blacklisting.",
      rejectionCriteriaHi: "कोई भी आपराधिक मामला या लंबित मुकदमा पाए जाने पर प्लेटफॉर्म से तत्काल आजीवन ब्लैकलिस्टिंग।",
    },
    {
      tierNumber: 3,
      tierNameEn: "Tier 3: Academic & Community Reference Verification",
      tierNameHi: "टियर 3: शैक्षणिक व सामुदायिक संदर्भ सत्यापन",
      mandatoryRequirementsEn: [
        "Verification calls with 2 independent local academic/community references (e.g. IITK/HBTI faculty, RWA)",
        "Proof of stable residence (minimum 2+ years residing at current Kanpur node location)",
        "Verified PG Owner host willingness interview regarding student hospitality & quiet study norms",
      ],
      mandatoryRequirementsHi: [
        "2 स्वतंत्र स्थानीय शैक्षणिक/सामुदायिक संदर्भों के साथ सत्यापन कॉल (उदा. IITK/HBTI फैकल्टी, आरडब्ल्यूए)",
        "स्थिर निवास का प्रमाण (वर्तमान कानपुर नोड स्थान पर न्यूनतम 2+ वर्ष का निवास)",
        "छात्र आतिथ्य और शांत अध्ययन नियमों के संबंध में वरिष्ठ होस्ट का साक्षात्कार",
      ],
      rejectionCriteriaEn: "Unverifiable community references or unstable residency history (<2 years) triggers mandatory manual review hold.",
      rejectionCriteriaHi: "असत्यापित सामुदायिक संदर्भ या अस्थिर निवास इतिहास (<2 वर्ष) पर मैन्युअल समीक्षा होल्ड।",
    },
    {
      tierNumber: 4,
      tierNameEn: "Tier 4: On-Site 12-Point Physical & Safety Audit",
      tierNameHi: "टियर 4: ऑन-साइट 12-बिंदु भौतिक व सुरक्षा ऑडिट",
      mandatoryRequirementsEn: [
        "Micro-storage node: 6-inch elevated wooden pallet installation (zero floor moisture/dampness)",
        "Co-living rooms: Lockable door, cross ventilation, adequate natural lighting, and RO water access",
        "Saarthi Kitchen hosts: Pure desi ghee, zero palm oil, 100% kitchen hygiene score (≥4.5/5)",
        "Smart motion sensor / emergency SOS button installation & live test call",
      ],
      mandatoryRequirementsHi: [
        "माइक्रो-स्टोरेज नोड: 6-इंच ऊंचे लकड़ी के पैलेट की स्थापना (शून्य जमीनी सीपेज)",
        "सह-आवास कमरा: लॉक योग्य दरवाजा, वेंटिलेशन, पर्याप्त प्राकृतिक रोशनी, आरओ पानी",
        "सारथी रसोई होस्ट: शुद्ध देसी घी, शून्य पाम ऑयल, 100% स्वच्छता स्कोर (≥4.5/5)",
        "स्मार्ट मोशन सेंसर / आपातकालीन एसओएस बटन स्थापना व लाइव टेस्ट कॉल",
      ],
      rejectionCriteriaEn: "Damp floors, compromised locks, or substandard kitchen hygiene results in immediate audit failure until remediated.",
      rejectionCriteriaHi: "सीपेज वाली जमीन, खराब ताले, या खराब रसोई स्वच्छता पाए जाने पर सुधार होने तक तुरंत ऑडिट फेल।",
    },
  ],
  hostGuaranteesEn: [
    "0% Listing & Platform Commission Fee — 100% net earnings paid directly into verified PG owner host bank account",
    "₹10,000 Protection & Damage Coverage — Embedded safety policy against accidental property damage",
    "24-Hour Student Relocation SLA — Immediate student relocation in case of house rule violation with zero rent loss",
    "100% Property Title Protection — Leave & License structure under TPA Sec 105 guarantees zero tenancy claim risk",
  ],
  hostGuaranteesHi: [
    "0% लिस्टिंग व प्लेटफॉर्म कमीशन - वरिष्ठ होस्ट के बैंक खाते में 100% शुद्ध कमाई का भुगतान",
    "₹10,000 सुरक्षा व क्षति कवर - आकस्मिक संपत्ति क्षति के खिलाफ एम्बेडेड सुरक्षा पॉलिसी",
    "24-घंटे छात्र रीलोकेशन SLA - गृह नियम उल्लंघन पर किराए के शून्य नुकसान के साथ तत्काल रीलोकेशन",
    "100% संपत्ति मालिकाना हक सुरक्षा - TPA Sec 105 के तहत लीव एंड लाइसेंस संरचना से शून्य किरायेदारी जोखिम",
  ],
};

export interface HostAgreementRecord {
  agreementId: string;
  hostName: string;
  hostPhone: string;
  nodeAddress: string;
  campusNode: string;
  timestamp: string;
  aadhaarVerified: boolean;
  policeClearanceAgreed: boolean;
  tpaSec105Accepted: boolean;
  houseRulesAccepted: boolean;
}

export function generateHostAgreementId(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `SS-HOST-POLICY-2026-${randNum}`;
}

const STORAGE_KEY = "ss_host_agreement_record";

export function saveHostAgreement(record: HostAgreementRecord): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (err) {
    console.warn("Failed to save host agreement to localStorage:", err);
  }
}

export function getHostAgreement(): HostAgreementRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HostAgreementRecord;
  } catch (err) {
    console.warn("Failed to parse host agreement from localStorage:", err);
    return null;
  }
}

export function clearHostAgreement(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear host agreement from localStorage:", err);
  }
}

