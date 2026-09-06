import { FOUNDER_PHONE_DISPLAY } from "@/lib/constants";

export interface KnowledgeChunk {
  id: string;
  category: "storage" | "rooms" | "kitchen" | "safety" | "transparency" | "host";
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  keywords: string[];
  citation: string;
}

export interface RagResponse {
  answer: string;
  answerHi: string;
  confidenceScore: number; // 0 - 100
  citations: string[];
  chunks: KnowledgeChunk[];
  suggestedQuestions: string[];
  suggestedQuestionsHi: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "kb-01",
    category: "transparency",
    question: "Is StashSaarthi reliable? How does it operate?",
    questionHi: "क्या StashSaarthi विश्वसनीय है? यह कैसे काम करता है?",
    answer:
      "StashSaarthi operates verified pilot nodes across Kanpur's academic corridor (IIT Kanpur, CSJMU, HBTI, GSVM, Kakadeo). All payments sit in digital escrow bank accounts, every luggage item is physically laser-sealed and insured up to ₹10,000, and our founder personally oversees operations.",
    answerHi:
      "StashSaarthi कानपुर के प्रमुख कैंपस कॉरिडोर (IITK, CSJMU, HBTI, GSVM, काकादेव) में सत्यापित नोड्स संचालित करता है। सभी भुगतान डिजिटल एस्क्रो में सुरक्षित रहते हैं, हर बैग पर लेजर सील और ₹10,000 का बीमा लागू रहता है।",
    keywords: [
      "reliable",
      "new",
      "early",
      "trust",
      "legit",
      "how",
      "operate",
      "founder",
      "escrow",
      "seal",
      "kanpur",
      "विश्वसनीय",
      "काम",
      "सुरक्षित",
      "संस्थापक",
    ],
    citation: "FAQ: Radical Transparency §1",
  },
  {
    id: "kb-02",
    category: "transparency",
    question: "Do you share or sell phone numbers, Aadhaar, or student data?",
    questionHi: "क्या आप मेरा फोन नंबर, आधार या डेटा बेचते हैं?",
    answer:
      "Never. We enforce a strict Zero Data Resale policy. We do not integrate third-party ad trackers or sell telemarketing lists. Student credentials and Aadhaar photos are encrypted and used strictly for node custody verification and emergency clearance.",
    answerHi:
      "बिल्कुल नहीं। हम शून्य डेटा बिक्री नीति का कड़ाई से पालन करते हैं। हम डेटा नहीं बेचते। आपके दस्तावेज केवल नोड कस्टडी सत्यापन के लिए सुरक्षित रखे जाते हैं।",
    keywords: [
      "data",
      "privacy",
      "phone",
      "aadhaar",
      "sell",
      "share",
      "security",
      "trackers",
      "डेटा",
      "गोपनीयता",
      "आधार",
      "बेचना",
    ],
    citation: "FAQ: Data Privacy Policy §2",
  },
  {
    id: "kb-03",
    category: "transparency",
    question: "What happens if a senior host cancels or locks the house during break?",
    questionHi: "यदि कोई होस्ट अचानक मना कर दे तो क्या होगा?",
    answer:
      "We guarantee a 24-Hour Relocation SLA. In the rare event of a host emergency, our on-ground Kanpur operations team dispatches a concierge to immediately transfer stored luggage or relocate staying students to a pre-verified backup node in the same locality at zero extra cost.",
    answerHi:
      "हम 24-घंटे रीलोकेशन SLA की गारंटी देते हैं। होस्ट आपात स्थिति में हमारी ऑन-ग्राउंड टीम तुरंत उसी इलाके में पूर्व-सत्यापित बैकअप नोड पर मुफ़्त स्थानांतरण सुनिश्चित करती है।",
    keywords: [
      "cancel",
      "lockout",
      "host issue",
      "emergency",
      "relocation",
      "backup",
      "sla",
      "मना",
      "ताला",
      "बैकअप",
      "स्थानांतरण",
    ],
    citation: "FAQ: Host Reliability SLA §3",
  },
  {
    id: "kb-04",
    category: "transparency",
    question: "How does StashSaarthi make money with zero brokerage on rooms?",
    questionHi: "बिना ब्रोकरेज के StashSaarthi कमाई कैसे करता है?",
    answer:
      "We earn through a 26.7% operational fee on luggage storage (₹80 margin per ₹300 bag/month) and a transparent 10% platform fee on co-living bookings (~₹500/month). We never charge 1-month brokerage fees or hidden convenience surcharges.",
    answerHi:
      "हमारी आय लगेज स्टोरेज पर 26.7% मार्जिन (₹80 प्रति ₹300 बैग/माह) और रूम बुकिंग पर केवल 10% प्लेटफॉर्म फीस से होती है। हम 1 महीने की ब्रोकरेज नहीं लेते।",
    keywords: [
      "money",
      "revenue",
      "business model",
      "brokerage",
      "fee",
      "pricing",
      "cost",
      "earning",
      "कमाई",
      "ब्रोकरेज",
      "शुल्क",
    ],
    citation: "FAQ: Unit Economics §4",
  },
  {
    id: "kb-05",
    category: "storage",
    question: "What are the storage rates and bag limits?",
    questionHi: "स्टोरेज की दरें और बैग सीमा क्या है?",
    answer:
      "Saarthi Stash charges a flat ₹300/bag per month for standard luggage (up to 30 kg / 80L volume). Additional oversized items like bicycles or heavy trunks carry custom micro-tiering starting at ₹450/month.",
    answerHi:
      "सार्थी स्टैश मानक लगेज (30 किग्रा / 80 लीटर तक) के लिए सपाट ₹300/बैग प्रति माह लेता है। साइकिल या भारी ट्रंक जैसी वस्तुओं के लिए दर ₹450/माह से शुरू होती है।",
    keywords: [
      "storage",
      "rate",
      "price",
      "bag",
      "cost",
      "month",
      "300",
      "luggage",
      "weight",
      "दर",
      "कीमत",
      "बैग",
      "स्टोरेज",
    ],
    citation: "Directives: Pricing Engine §1",
  },
  {
    id: "kb-06",
    category: "storage",
    question: "Can I retrieve my stored luggage early?",
    questionHi: "क्या मैं अपना सामान समय से पहले वापस ले सकता हूँ?",
    answer:
      "Yes, early retrieval is supported with 48 hours advance notice via WhatsApp or dashboard. Your designated Concierge will coordinate doorstep delivery without exit penalties.",
    answerHi:
      "हाँ, 48 घंटे पहले व्हाट्सएप या डैशबोर्ड पर सूचना देकर समय से पहले सामान लिया जा सकता है। बिना किसी पेनल्टी के कंसीयज डिलीवरी करेंगे।",
    keywords: [
      "early",
      "retrieval",
      "pickup",
      "collect",
      "return",
      "plans change",
      "notice",
      "समय से पहले",
      "वापसी",
      "पिकअप",
    ],
    citation: "FAQ: Storage Logistics §1",
  },
  {
    id: "kb-07",
    category: "storage",
    question: "What items are strictly prohibited in micro-storage?",
    questionHi: "स्टोरेज में किन वस्तुओं को रखने की मनाही है?",
    answer:
      "Perishable foods, open liquids, unsealed cosmetics, weapons, inflammable liquids, cash, gold, and illegal contraband are strictly prohibited. Every bag is inspected and laser-sealed at pickup.",
    answerHi:
      "खराब होने वाला खाना, खुली तरल वस्तुएं, हथियार, ज्वलनशील पदार्थ, नकदी, सोना और गैर-कानूनी वस्तुएं वर्जित हैं। पिकअप पर लेजर-सीलिंग की जाती है।",
    keywords: [
      "prohibited",
      "allowed",
      "banned",
      "items",
      "food",
      "cash",
      "liquids",
      "weapons",
      "मनाही",
      "प्रतिबंधित",
      "वस्तुएं",
    ],
    citation: "FAQ: Storage Safety Rules §2",
  },
  {
    id: "kb-08",
    category: "safety",
    question: "How does the ₹10,000 micro-insurance claim work?",
    questionHi: "₹10,000 का माइक्रो-बीमा क्लेम कैसे काम करता है?",
    answer:
      "Every bag receives a laser-engraved serialized tamper barcode seal and timestamped photos at pickup. If verifiable damage occurs upon return, compensation up to ₹10,000 is disbursed directly to your bank within 48 hours.",
    answerHi:
      "पिकअप पर हर बैग पर लेजर-सीरियल बारकोड सील और फोटो लॉग बनता है। वापसी पर क्षति पाए जाने पर ₹10,000 तक का क्लेम 48 घंटे में सीधे बैंक खाते में भेजा जाता है।",
    keywords: [
      "insurance",
      "claim",
      "10000",
      "damage",
      "loss",
      "compensation",
      "seal",
      "barcode",
      "बीमा",
      "क्लेम",
      "क्षति",
      "नुकसान",
    ],
    citation: "FAQ: Safety & Claims §2",
  },
  {
    id: "kb-09",
    category: "rooms",
    question: "How do zero-brokerage co-living rooms work?",
    questionHi: "जीरो-ब्रोकरेज रूम बुकिंग कैसे काम करती है?",
    answer:
      "Saarthi Spaces lists verified single & double sharing rooms directly from senior hosts and house owners near IITK, Kakadeo, and CSJMU. You connect directly with the host, pay 0% broker fee, and enjoy verified student community stay starting at ₹5,500/month.",
    answerHi:
      "सार्थी स्पेस वरिष्ठ नागरिकों और मकान मालिकों से सीधे कमरे सूचीबद्ध करता है। आप 0% ब्रोकरेज पर सीधे होस्ट से जुड़ते हैं, ₹5,500/माह से कमरे उपलब्ध हैं।",
    keywords: [
      "room",
      "pg",
      "hostel",
      "co-living",
      "brokerage",
      "stay",
      "single",
      "sharing",
      "rent",
      "कमरा",
      "पीजी",
      "ब्रोकरेज",
      "किराया",
    ],
    citation: "Directives: Saarthi Spaces §2",
  },
  {
    id: "kb-10",
    category: "kitchen",
    question: "What is Saarthi Kitchen and how much does a meal cost?",
    questionHi: "सार्थी किचन क्या है और भोजन की कीमत क्या है?",
    answer:
      "Saarthi Kitchen delivers home-cooked, pure desi ghee 'Ghar Ka Swaad' tiffins prepared by verified local Kanpur senior home-makers. Meals start at ₹90/single meal token or ₹2,400/month full tiffin plan with 1-tap pause options.",
    answerHi:
      "सार्थी किचन वरिष्ठ महिलाओं द्वारा तैयार शुद्ध देसी घी 'घर का स्वाद' टिफिन डिलीवर करता है। भोजन ₹90/मील या ₹2,400/माह टिफिन प्लान पर उपलब्ध है।",
    keywords: [
      "kitchen",
      "tiffin",
      "food",
      "meal",
      "thali",
      "ghar ka swaad",
      "price",
      "90",
      "2400",
      "खाना",
      "टिफिन",
      "भोजन",
      "घर का स्वाद",
    ],
    citation: "Directives: Saarthi Kitchen §3",
  },
  {
    id: "kb-11",
    category: "host",
    question: "How can senior citizens earn passive income as a StashHost?",
    questionHi: "वरिष्ठ नागरिक स्टैशहोस्ट बनकर निष्क्रिय आय कैसे कमा सकते हैं?",
    answer:
      "Senior Hosts earn ₹11,500+/month by monetizing spare bedrooms or clean storage rooms. Hosts maintain 100% control over house rules, receive weekly direct bank escrow payouts, get 24/7 SOS helpline coverage, and ₹10,000 property protection.",
    answerHi:
      "सीनियर होस्ट खाली कमरों को साझा करके ₹11,500+/माह कमाते हैं। होस्ट को घर के नियमों पर 100% नियंत्रण, साप्ताहिक बैंक भुगतान, और 24/7 SOS सहायता मिलती है।",
    keywords: [
      "host",
      "senior",
      "passive income",
      "earn",
      "11500",
      "spare room",
      "payout",
      "escrow",
      "होस्ट",
      "सीनियर",
      "कमाई",
      "कमरा",
    ],
    citation: "Directives: Senior Host Charter §1",
  },
  {
    id: "kb-12",
    category: "transparency",
    question: "How can I contact a real human member of StashSaarthi?",
    questionHi: "मैं StashSaarthi की टीम से कैसे संपर्क कर सकता हूँ?",
    answer: `You can reach our founder and on-ground Kanpur operations crew directly via WhatsApp or Phone call at ${FOUNDER_PHONE_DISPLAY} with a guaranteed 15-minute response SLA during campus hours (8 AM - 10 PM IST).`,
    answerHi: `आप हमारे संस्थापक और ऑपरेशंस टीम से सीधे व्हाट्सएप या फोन पर (${FOUNDER_PHONE_DISPLAY}) संपर्क कर सकते हैं। सुबह 8 से रात 10 बजे के बीच 15 मिनट में जवाब दिया जाएगा।`,
    keywords: [
      "contact",
      "human",
      "phone",
      "whatsapp",
      "call",
      "support",
      "number",
      "founder",
      "help",
      "संपर्क",
      "फोन",
      "व्हाट्सएप",
      "मदद",
    ],
    citation: "FAQ: Direct Contact SLA §5",
  },
];

/**
 * Clean & tokenize text string into keywords (lowercase, stripped punctuation)
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Retrieve top relevant knowledge chunks using TF-IDF / keyword overlap matching
 */
export function retrieveKnowledgeChunks(query: string, limit = 3): KnowledgeChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return KNOWLEDGE_BASE.slice(0, limit);

  const scored = KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;

    // Check keyword exact matches (weight: 3)
    chunk.keywords.forEach((kw) => {
      const kwTokens = tokenize(kw);
      if (kwTokens.some((t) => queryTokens.includes(t))) {
        score += 3;
      }
    });

    // Check question title overlap (weight: 4)
    const qTokens = tokenize(chunk.question + " " + chunk.questionHi);
    queryTokens.forEach((qt) => {
      if (qTokens.includes(qt)) score += 4;
    });

    // Check answer content overlap (weight: 1)
    const aTokens = tokenize(chunk.answer + " " + chunk.answerHi);
    queryTokens.forEach((qt) => {
      if (aTokens.includes(qt)) score += 1;
    });

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const filtered = scored.filter((item) => item.score > 0);

  if (filtered.length === 0) {
    // Return top 2 default transparency chunks if no match
    return KNOWLEDGE_BASE.slice(0, limit);
  }

  return filtered.slice(0, limit).map((item) => item.chunk);
}

/**
 * RAG Generator: Synthesizes a contextual answer from retrieved knowledge chunks
 */
export function generateRagResponse(userQuery: string, language: "en" | "hi" = "en"): RagResponse {
  const chunks = retrieveKnowledgeChunks(userQuery, 3);
  const queryTokens = tokenize(userQuery);

  // Determine top match quality
  let topScore = 0;
  const primaryChunk: KnowledgeChunk = chunks[0] ?? KNOWLEDGE_BASE[0]!;

  if (queryTokens.length > 0) {
    primaryChunk.keywords.forEach((kw) => {
      if (queryTokens.includes(kw.toLowerCase())) topScore += 25;
    });
    const titleTokens = tokenize(primaryChunk.question + " " + primaryChunk.questionHi);
    queryTokens.forEach((qt) => {
      if (titleTokens.includes(qt)) topScore += 30;
    });
  } else {
    topScore = 50;
  }

  const confidenceScore = Math.min(98, Math.max(35, topScore > 0 ? topScore + 30 : 40));

  const isHi = language === "hi";

  let answerText = isHi ? primaryChunk.answerHi : primaryChunk.answer;
  let answerTextHi = primaryChunk.answerHi;

  // Add contextual synthesis if multi-chunk
  if (chunks.length > 1 && confidenceScore > 60 && chunks[1]) {
    const secondary = chunks[1];
    const synthEn = `\n\n📌 Additional context: ${secondary.answer}`;
    const synthHi = `\n\n📌 अतिरिक्त जानकारी: ${secondary.answerHi}`;
    answerText += synthEn;
    answerTextHi += synthHi;
  }

  // Low confidence fallback prompt addition
  if (confidenceScore < 50) {
    const fallbackEn = `\n\n💬 Need instant custom help? Call or WhatsApp our founder directly at ${FOUNDER_PHONE_DISPLAY}.`;
    const fallbackHi = `\n\n💬 सीधे सहायता चाहिए? हमारे संस्थापक को व्हाट्सएप पर मैसेज करें: ${FOUNDER_PHONE_DISPLAY}।`;
    answerText += fallbackEn;
    answerTextHi += fallbackHi;
  }

  const citations = Array.from(new Set(chunks.map((c) => c.citation)));

  const suggestedQuestions = [
    "How does the ₹10,000 luggage insurance work?",
    "Where are StashNodes located in Kanpur?",
    "What are the rates for zero-brokerage rooms?",
  ];

  const suggestedQuestionsHi = [
    "₹10,000 का सामान बीमा कैसे काम करता है?",
    "कानपुर में स्टैश नोड्स कहाँ स्थित हैं?",
    "जीरो-ब्रोकरेज कमरों का किराया कितना है?",
  ];

  return {
    answer: answerText,
    answerHi: answerTextHi,
    confidenceScore,
    citations,
    chunks,
    suggestedQuestions,
    suggestedQuestionsHi,
  };
}
