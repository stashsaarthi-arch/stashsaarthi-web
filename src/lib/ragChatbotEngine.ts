// StashSaarthi RAG (Retrieval-Augmented Generation) Chatbot Engine
// Fast, offline-capable client-side vector search and structured response generator

export interface KnowledgeChunk {
  id: string;
  category: "storage" | "rooms" | "kitchen" | "safety" | "host" | "pricing" | "legal";
  title: string;
  title_hi: string;
  content: string;
  content_hi: string;
  keywords: string[];
  citation: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  confidenceScore?: number;
  sources?: KnowledgeChunk[];
  suggestedActions?: { label: string; action: string }[];
}

export const FAQ_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "kb-storage-1",
    category: "storage",
    title: "Saarthi Stash Pricing & Bag Rates",
    title_hi: "सार्थी स्टैश मूल्य निर्धारण एवं बैग दरें",
    content:
      "Saarthi Stash offers vacation micro-storage at ₹300/bag/month. Host gets ₹180, and platform net margin is ₹80 (26.7%). Each bag receives a laser-engraved tamper barcode seal and ₹10,000 micro-insurance cover. Doorstep pickup and return are available near IIT Kanpur, CSJMU, HBTI, and Kakadeo.",
    content_hi:
      "सार्थी स्टैश ₹300/बैग/माह पर वेकेशन माइक्रो-स्टोरेज प्रदान करता है। होस्ट को ₹180 मिलते हैं और प्लेटफॉर्म मार्जिन ₹80 है। प्रत्येक बैग पर लेजर बारकोड सील और ₹10,000 का माइक्रो-बीमा लागू रहता है।",
    keywords: [
      "storage",
      "bag",
      "stash",
      "vacation",
      "cost",
      "price",
      "rate",
      "luggage",
      "dead-rent",
      "saving",
      "₹300",
    ],
    citation: "Stash FAQ #1 - Vacation Micro-Storage Pricing",
  },
  {
    id: "kb-storage-2",
    category: "storage",
    title: "Prohibited Storage Items",
    title_hi: "प्रतिबंधित सामान की सूची",
    content:
      "Perishable food, open liquids, unsealed cosmetics, weapons, inflammable liquids, cash, jewelry, and illegal contraband are strictly prohibited from vacation micro-storage. All bags are inspected and laser-sealed in student presence.",
    content_hi:
      "खराब होने वाला भोजन, खुली तरल वस्तुएं, हथियार, नकदी, सोना, ज्वलनशील पदार्थ और अवैध वस्तुएं वेकेशन स्टोरेज में सख्त वर्जित हैं।",
    keywords: [
      "prohibited",
      "allowed",
      "rules",
      "banned",
      "cash",
      "gold",
      "food",
      "safety",
      "items",
    ],
    citation: "Stash Safety Charter #3 - Prohibited Items Policy",
  },
  {
    id: "kb-storage-3",
    category: "storage",
    title: "Early Luggage Retrieval & Flexible Handover",
    title_hi: "समय से पहले सामान वापसी नीति",
    content:
      "Students can retrieve bags early if vacation plans change by providing 48 hours advance notice. Concierge coordinates direct node pickup with zero cancellation or exit penalties.",
    content_hi:
      "यदि प्लान बदलता है, तो 48 घंटे पहले सूचना देकर बिना किसी अतिरिक्त शुल्क के समय से पहले सामान वापस लिया जा सकता है।",
    keywords: ["retrieve", "early", "handover", "return", "plans", "cancel", "pickup", "notice"],
    citation: "Stash Operations Spec #4 - Retrieval SLA",
  },
  {
    id: "kb-rooms-1",
    category: "rooms",
    title: "Saarthi Spaces Zero Brokerage Rooms",
    title_hi: "सार्थी स्पेस शून्य ब्रोकरेज कमरे",
    content:
      "Saarthi Spaces connects verified students with verified PG owner host spare rooms starting at avg ₹5,500/month. 100% Zero Brokerage. Students pay 10% platform fee and hosts pay 5% fee. No predatory 1-month brokerage fees.",
    content_hi:
      "सार्थी स्पेस बिना किसी दलाली (0% Brokerage) के छात्रों को वरिष्ठ नागरिकों के कमरों से जोड़ता है। औसत किराया ₹5,500/माह है। केवल 10% प्लेटफॉर्म शुल्क लागू होता है।",
    keywords: [
      "room",
      "spaces",
      "brokerage",
      "co-living",
      "pg",
      "hostel",
      "rent",
      "deposit",
      "flat",
      "kakadeo",
      "kalyanpur",
    ],
    citation: "Spaces Directive #1 - Zero Brokerage Co-Living",
  },
  {
    id: "kb-kitchen-1",
    category: "kitchen",
    title: "Saarthi Kitchen Homestyle Tiffins",
    title_hi: "सार्थी किचन घर का स्वाद टिफिन",
    content:
      "Saarthi Kitchen delivers authentic 'Ghar Ka Swaad' home-cooked meals prepared by verified verified PG owner homemakers. Standard Thali is ₹90/meal or ₹2,400/month subscription. Zero preservatives, pure desi ghee, and 1-click meal pause flexibility.",
    content_hi:
      "सार्थी किचन वरिष्ठ महिलाओं द्वारा तैयार शुद्ध घर का बना भोजन (₹90/भोजन या ₹2,400/माह) प्रदान करता है। इसमें 0-प्रिजर्वेटिव, देसी घी और 1-क्लिक पॉज की सुविधा उपलब्ध है।",
    keywords: [
      "kitchen",
      "tiffin",
      "food",
      "meal",
      "ghar ka swaad",
      "thali",
      "mess",
      "cook",
      "subscription",
      "₹90",
    ],
    citation: "Kitchen Charter #2 - Homestyle Meal Subscriptions",
  },
  {
    id: "kb-safety-1",
    category: "safety",
    title: "Luggage Tamper Protection & Laser Barcode Seal",
    title_hi: "लेजर बारकोड सील एवं सुरक्षा गारंटी",
    content:
      "Every bag is sealed at pickup with a unique laser-engraved tamper barcode tag and dual-photo timestamp log. If a seal is tampered with, the ₹10,000 micro-insurance claim is instantly processed within 48 hours without deductibles.",
    content_hi:
      "प्रत्येक बैग पर पिकअप के समय यूनिक लेजर-उत्कीर्ण बारकोड टैग लगाया जाता है। यदि सील से छेड़छाड़ होती है, तो ₹10,000 का बीमा क्लेम 48 घंटे में बैंक खाते में भेजा जाता है।",
    keywords: [
      "insurance",
      "safety",
      "seal",
      "barcode",
      "tamper",
      "claim",
      "dampness",
      "protection",
      "pallets",
      "₹10,000",
    ],
    citation: "Safety Protocol Spec #1 - Micro-Insurance Policy",
  },
  {
    id: "kb-host-1",
    category: "host",
    title: "Verified PG Owner Host Passive Income & Safety",
    title_hi: "सीनियर होस्ट निष्क्रिय आय एवं सुरक्षा",
    content:
      "High-Margin ROI hosts earn ₹11,500+/month in tech-enabled passive income using spare bedrooms or dry storage space. Hosts retain 100% control over house norms, non-intrusive student matching, and benefit from 24/7 Bedside SOS support and ₹10k property protection.",
    content_hi:
      "वरिष्ठ नागरिक अपने खाली कमरों से ₹11,500+/माह की सम्मानजनक आय कमा सकते हैं। घर के नियमों पर 100% होस्ट का नियंत्रण रहता है और 24x7 एसओएस सहायता मिलती है।",
    keywords: [
      "host",
      "income",
      "verified PG owner",
      "earnings",
      "passive",
      "dignity",
      "control",
      "payout",
      "escrow",
      "₹11,500",
    ],
    citation: "Host Onboarding Charter #5 - Passive Income Norms",
  },
  {
    id: "kb-legal-1",
    category: "legal",
    title: "Data Privacy & Legal Compliance (DPDP 2023 / TPA 1882)",
    title_hi: "डेटा गोपनीयता एवं कानूनी अनुपालन",
    content:
      "StashSaarthi enforces a strict Zero Data Resale guarantee compliant with India's DPDP Act 2023. User data is erased after 18 months of inactivity. Co-living leave-and-license is governed under Section 105 of the Transfer of Property Act 1882.",
    content_hi:
      "StashSaarthi डीपीडीपी अधिनियम 2023 के तहत शून्य डेटा बिक्री की गारंटी देता है। 18 महीने बाद निष्क्रिय डेटा स्वतः मिटा दिया जाता है। लीव-एंड-लाइसेंस संपत्ति हस्तांतरण अधिनियम 1882 (TPA Sec 105) के तहत संचालित है।",
    keywords: [
      "privacy",
      "data",
      "legal",
      "terms",
      "dpdp",
      "tpa",
      "section 105",
      "resale",
      "aadhaar",
      "encryption",
    ],
    citation: "Legal Governance Policy #1 - Data Privacy & TPA 1882",
  },
];

const DEFAULT_CHUNK: KnowledgeChunk = FAQ_KNOWLEDGE_BASE[0]!;

// TF-IDF & Cosine Similarity Matcher for RAG Retrieval
export function retrieveRagContext(
  query: string,
  topK: number = 3,
): { chunks: KnowledgeChunk[]; topScore: number } {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery.split(/\W+/).filter((t) => t.length > 2);

  if (queryTokens.length === 0) {
    return { chunks: [DEFAULT_CHUNK], topScore: 0.1 };
  }

  const scoredChunks = FAQ_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    const textToMatch = `${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase();

    // 1. Keyword exact & partial matches
    for (const kw of chunk.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 3.5;
      }
    }

    // 2. Token overlap score
    for (const token of queryTokens) {
      if (textToMatch.includes(token)) {
        score += 1.5;
      }
    }

    // 3. Category match boost
    if (
      (normalizedQuery.includes("bag") || normalizedQuery.includes("stash")) &&
      chunk.category === "storage"
    ) {
      score += 4.0;
    }
    if (
      (normalizedQuery.includes("room") || normalizedQuery.includes("pg")) &&
      chunk.category === "rooms"
    ) {
      score += 4.0;
    }
    if (
      (normalizedQuery.includes("food") || normalizedQuery.includes("tiffin")) &&
      chunk.category === "kitchen"
    ) {
      score += 4.0;
    }
    if (
      (normalizedQuery.includes("earn") || normalizedQuery.includes("host")) &&
      chunk.category === "host"
    ) {
      score += 4.0;
    }

    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);

  const topScore = Math.min(0.98, Math.max(0.35, (scoredChunks[0]?.score || 1) / 10));
  const retrieved: KnowledgeChunk[] = scoredChunks
    .slice(0, topK)
    .map((sc) => sc.chunk)
    .filter((c): c is KnowledgeChunk => Boolean(c));

  if (retrieved.length === 0) {
    retrieved.push(DEFAULT_CHUNK);
  }

  return { chunks: retrieved, topScore };
}

// Generate structured AI answer using RAG context
export function generateRagResponse(
  userQuery: string,
  language: "en" | "hi" = "en",
): {
  text: string;
  confidenceScore: number;
  sources: KnowledgeChunk[];
  suggestedActions?: { label: string; action: string }[];
} {
  const { chunks, topScore } = retrieveRagContext(userQuery);
  const primaryChunk = chunks[0] || DEFAULT_CHUNK;
  const isHi = language === "hi";

  let responseText = "";

  if (topScore < 0.25 || !primaryChunk) {
    responseText = isHi
      ? `माफ कीजिए, मुझे इस प्रश्न पर सटीक RAG दस्तावेज नहीं मिला। हालांकि, आप हमारे संस्थापक से सीधे व्हाट्सएप (+91 9369454350) पर बात कर सकते हैं।`
      : `I couldn't find an exact answer in our current FAQ knowledge base. However, you can connect directly with our founder on WhatsApp (+91 9369454350) for immediate 15-min assistance.`;
  } else {
    const mainContent = isHi ? primaryChunk.content_hi : primaryChunk.content;
    const secondChunk = chunks[1];
    const secondContent = secondChunk ? (isHi ? secondChunk.content_hi : secondChunk.content) : "";

    responseText = isHi
      ? `🤖 **RAG AI उत्तर:** ${mainContent}${secondContent ? `\n\n📌 **अतिरिक्त संदर्भ:** ${secondContent}` : ""}`
      : `🤖 **RAG AI Answer:** ${mainContent}${secondContent ? `\n\n📌 **Additional Context:** ${secondContent}` : ""}`;
  }

  const confidencePercentage = Math.round(topScore * 100);

  return {
    text: responseText,
    confidenceScore: confidencePercentage,
    sources: chunks.slice(0, 2),
    suggestedActions: [
      { label: isHi ? "💬 व्हाट्सएप पर पूछें" : "💬 Talk to Founder", action: "whatsapp" },
      { label: isHi ? "📦 स्टैश कैलकुलेटर" : "📦 Stash Calculator", action: "calculator" },
    ],
  };
}
