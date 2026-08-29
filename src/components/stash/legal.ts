export const smoothScrollTo = (id: string, offset = -75) => (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  if (!id || typeof window === "undefined") return;

  // Resolve alias routes
  let targetId = id.replace(/^#/, "");
  if (targetId === "calculator" || targetId === "stash") {
    const role = typeof document !== "undefined" ? document.documentElement.dataset["role"] : "student";
    targetId = role === "host" ? "host-earnings-calculator" : "student-calculator";
  } else if (targetId === "safety-protocol" || targetId === "safety") {
    targetId = document.getElementById("safety-protocol") ? "safety-protocol" : "trust";
  } else if (targetId === "waitlist" || targetId === "waitlist-form") {
    targetId = "waitlist-form";
  }

  const el = document.getElementById(targetId) || document.getElementById(id.replace(/^#/, ""));
  if (!el) return;

  const lenis = (window as any).__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, {
      offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition + offset);
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export type Doc = { title: string; title_hi?: string; body: string[]; body_hi?: string[] };

export const DOCS: Record<string, Doc> = {
  about: {
    title: "About us",
    title_hi: "हमारे बारे में",
    body: [
      "StashSaarthi is India's hyper-local living ecosystem, built to solve two problems at once: students who move cities every few months, and seniors who have unused space and untapped time.",
      "We map unused rooms, kitchens and storage corners in trusted neighbourhoods, verify them on-site, and connect them to students who need affordable, brokerage-free living.",
      "Founded in Kanpur, we now operate pilot belts in Lucknow, Delhi NCR and Pune with a community-first, zero-CapEx model.",
    ],
    body_hi: [
      "स्टैशसारथी भारत का हाइपर-लोकल लिविंग इकोसिस्टम है, जो एक साथ दो समस्याओं को हल करता है: वे छात्र जो हर कुछ महीनों में शहर बदलते हैं, और वे बुजुर्ग जिनके पास खाली जगह और समय उपलब्ध है।",
      "हम सुरक्षित मोहल्लों में खाली कमरों, रसोई और स्टोरेज कोनों को ऑन-साइट सत्यापित करते हैं और उन्हें ऐसे छात्रों से जोड़ते हैं जिन्हें किफायती, ब्रोकरेज-मुक्त आवास चाहिए।",
      "कानपुर से शुरू होकर, अब हम लखनऊ, दिल्ली एनसीआर और पुणे में कम्युनिटी-फर्स्ट, जीरो-कैपेक्स मॉडल के साथ पायलट नोड्स संचालित कर रहे हैं।",
    ],
  },
  micro: {
    title: "Micro-Opportunity",
    title_hi: "माइक्रो-अवसर",
    body: [
      "Every verified senior host, home chef and stash keeper on StashSaarthi earns a recurring micro-income from assets they already own.",
      "A single spare room, one extra tiffin a day, or four square feet of storage can add ₹3,000–₹12,000 a month without any upfront investment.",
      "Write to us and our community team will walk you through onboarding, verification and payouts.",
    ],
    body_hi: [
      "स्टैशसारथी पर हर सत्यापित सीनियर होस्ट, होम शेफ और स्टैश कीपर अपनी मौजूदा संपत्तियों से नियमित अतिरिक्त आय अर्जित करता है।",
      "एक खाली कमरा, रोजाना एक अतिरिक्त टिफिन या चार वर्ग फुट की स्टोरेज जगह बिना किसी निवेश के हर महीने ₹3,000–₹12,000 जोड़ सकती है।",
      "हमसे संपर्क करें और हमारी टीम आपको ऑनबोर्डिंग, सत्यापन और साप्ताहिक भुगतान में पूरी सहायता करेगी।",
    ],
  },
  partner: {
    title: "Partner with us",
    title_hi: "हमारे साथ साझेदारी करें",
    body: [
      "We partner with hostels, PG owners, resident welfare associations, campus clubs and local logistics teams.",
      "Partners get access to verified student demand, our trust and audit framework, and transparent revenue sharing.",
      "Share your details through the waitlist form and a partnerships lead will reach out within 24 hours.",
    ],
    body_hi: [
      "हम हॉस्टलों, पीजी मालिकों, रेजिडेंट वेलफेयर एसोसिएशनों, कॉलेज क्लबों और स्थानीय लॉजिस्टिक्स टीमों के साथ साझेदारी करते हैं।",
      "पार्टनर्स को सत्यापित छात्र मांग, हमारा ट्रस्ट फ्रेमवर्क और पारदर्शी राजस्व साझाकरण प्राप्त होता है।",
      "वेटलिस्ट फॉर्म के माध्यम से अपनी जानकारी साझा करें और हमारी पार्टनरशिप टीम 24 घंटे में संपर्क करेगी।",
    ],
  },
  careers: {
    title: "Careers",
    title_hi: "करियर",
    body: [
      "We are a small, high-ownership team building physical-world infrastructure with software discipline.",
      "Open areas: city operations, trust & safety, community growth, and full-stack engineering.",
      "There is no formal listings board yet — join the waitlist with a note about what you would like to build and we will get in touch.",
    ],
    body_hi: [
      "हम एक केंद्रित और समर्पित टीम हैं जो सॉफ्टवेयर अनुशासन के साथ भौतिक दुनिया के लिए बुनियादी ढांचा तैयार कर रही है।",
      "खुले क्षेत्र: सिटी ऑपरेशंस, ट्रस्ट एवं सुरक्षा, कम्युनिटी ग्रोथ और फुल-स्टैक इंजीनियरिंग।",
      "वेटलिस्ट में अपने परिचय के साथ शामिल हों और हम आपसे सीधे संपर्क करेंगे।",
    ],
  },
  terms: {
    title: "Terms of service",
    title_hi: "सेवा की शर्तें",
    body: [
      "By using StashSaarthi you agree to provide accurate information and to use the platform only for lawful, personal purposes.",
      "Listings, prices and availability shown are indicative and subject to on-site verification. Final agreements are signed directly between you and the host, owner or kitchen partner.",
      "We may suspend accounts that misuse the platform, misrepresent property details or violate community safety norms.",
      "This is a placeholder summary intended for demonstration and will be replaced by our full legal terms before commercial launch.",
    ],
    body_hi: [
      "स्टैशसारथी का उपयोग करके आप सटीक जानकारी प्रदान करने और प्लेटफॉर्म का उपयोग केवल वैध, व्यक्तिगत उद्देश्यों के लिए करने के लिए सहमत होते हैं।",
      "दिखाए गए मूल्य और उपलब्धता ऑन-साइट सत्यापन के अधीन हैं। अंतिम समझौते आपके और होस्ट/मालिक के बीच सीधे हस्ताक्षरित होते हैं।",
      "सामुदायिक सुरक्षा नियमों का उल्लंघन करने वाले खातों को निलंबित किया जा सकता है।",
    ],
  },
  privacy: {
    title: "Privacy policy",
    title_hi: "गोपनीयता नीति",
    body: [
      "We collect only the details you submit — name, email, phone, city and the preferences relevant to your request.",
      "Your data is stored securely and is never sold. It is used to contact you about your enquiry and to improve service quality in your city.",
      "You can request deletion of your data at any time by contacting our support team.",
    ],
    body_hi: [
      "हम केवल वही जानकारी एकत्र करते हैं जो आप सबमिट करते हैं — नाम, ईमेल, फोन नंबर और आपकी आवश्यकताएं।",
      "आपका डेटा सुरक्षित रूप से संग्रहीत किया जाता है और कभी बेचा नहीं जाता। इसका उपयोग केवल आपकी सहायता के लिए किया जाता है।",
      "आप किसी भी समय हमारी सहायता टीम से संपर्क करके अपना डेटा हटाने का अनुरोध कर सकते हैं।",
    ],
  },
  liability: {
    title: "Storage liability",
    title_hi: "स्टोरेज सुरक्षा व उत्तरदायित्व",
    body: [
      "Stashed items are stored in audited neighbourhood spaces with CCTV coverage, tamper-evident sealing and a photo inventory taken at pickup.",
      "Coverage applies to declared items only. Cash, jewellery, documents, perishables and hazardous materials must not be stashed.",
      "Claims must be raised within 48 hours of return along with the digital inventory reference.",
    ],
    body_hi: [
      "संग्रहीत वस्तुएं सीसीटीवी निगरानी, छेड़छाड़-रोधी सीलिंग और फोटो इन्वेंट्री के साथ ऑडिट किए गए स्थानों में सुरक्षित रखी जाती हैं।",
      "सुरक्षा केवल घोषित वस्तुओं पर लागू होती है। नकदी, आभूषण, दस्तावेज, खराब होने वाली वस्तुएं और ज्वलनशील पदार्थ रखना सख्त वर्जित है।",
      "सामान वापस मिलने के 48 घंटे के भीतर डिजिटल संदर्भ के साथ क्लेम दर्ज किया जा सकता है।",
    ],
  },
  refund: {
    title: "Refund policy",
    title_hi: "रिफंड नीति",
    body: [
      "Cancellations made more than 24 hours before a scheduled pickup are fully refundable.",
      "Storage plans cancelled mid-cycle are refunded on a pro-rata basis for whole unused months.",
      "Refunds are processed to the original payment method within 5–7 working days.",
    ],
    body_hi: [
      "शेड्यूल पिकअप से 24 घंटे पहले रद्दीकरण पर 100% पूर्ण रिफंड प्रदान किया जाता है।",
      "बीच में रद्द किए गए प्लान पर अप्रयुक्त महीनों का आनुपातिक रिफंड दिया जाता है।",
      "रिफंड 5-7 कार्य दिवसों के भीतर मूल भुगतान माध्यम में जमा कर दिया जाता है।",
    ],
  },
};

export const handleDownloadInvestorMemo = (language: "en" | "hi" = "en") => {
  const isHi = language === "hi";
  const memoContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>StashSaarthi - ${isHi ? "कार्यकारी इन्वेस्टर ब्रीफ (2026)" : "Executive Investor Memo (2026)"}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: auto; }
          h1 { color: #0A0D0F; font-size: 26px; border-bottom: 2px solid #F59E0B; padding-bottom: 8px; }
          .tagline { color: #D97706; font-weight: bold; font-size: 15px; margin-top: -10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
          .card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; background: #F9FAFB; }
          .metric { font-size: 22px; font-weight: bold; color: #10B981; }
          .footer { margin-top: 40px; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 12px; }
        </style>
      </head>
      <body>
        <h1>StashSaarthi | ${isHi ? "कार्यकारी इन्वेस्टर ब्रीफ" : "Executive Investor Brief"}</h1>
        <p class="tagline">${isHi ? "भारत का जीरो-कैपेक्स अंतर-पीढ़ी आवास एवं कैंपस माइक्रो-स्टोरेज प्लेटफॉर्म" : "India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform"}</p>
        
        <h3>${isHi ? "1. समस्या" : "1. The Problem"}</h3>
        <p>${isHi ? "छात्र छुट्टियों में ₹4,000–₹8,000 का खाली किराया और 1 महीने की ब्रोकरेज देते हैं, जबकि शहरी वरिष्ठ नागरिक अकेलेपन और खाली जगहों के साथ रहते हैं।" : "Students face ₹4,000–₹8,000 dead vacation rent and 1-month broker fees, while urban senior citizens live in quiet, unmonetized spaces with isolation risks."}</p>

        <h3>${isHi ? "2. समाधान एवं यूनिट इकोनॉमिक्स" : "2. The Solution & Unit Economics"}</h3>
        <div class="grid">
          <div class="card">
            <h4>Saarthi Stash (${isHi ? "स्टोरेज" : "Storage"})</h4>
            <div class="metric">₹300 / ${isHi ? "बैग / माह" : "bag / mo"}</div>
            <p>${isHi ? "होस्ट को ₹180 | नेट मार्जिन: ₹80 (26.7%)। बारकोड सील + ₹10,000 बीमा।" : "Host takes ₹180 | Net Margin: ₹80 (26.7%). Tamper-evident barcode seal + ₹10k insurance."}</p>
          </div>
          <div class="card">
            <h4>Saarthi Spaces (${isHi ? "कमरे" : "Stays"})</h4>
            <div class="metric">₹5,500 / ${isHi ? "माह औसत" : "mo Avg"}</div>
            <p>${isHi ? "शून्य ब्रोकरेज। 10% छात्र फीस + 5% होस्ट फीस। नेट प्लेटफॉर्म लाभ: ₹700/माह।" : "Zero brokerage. 10% student fee + 5% host fee. Net Platform Profit: ₹700/mo."}</p>
          </div>
        </div>

        <h3>${isHi ? "3. सुरक्षा व विश्वास इंफ्रास्ट्रक्चर" : "3. Moat & Trust Infrastructure"}</h3>
        <p>${isHi ? "• 3-स्तरीय आधार व पुलिस सत्यापन • 100% डिजिटल एस्क्रो • वियरेबल आपातकालीन एसओएस • सीलबंद कस्टडी-चेन।" : "• 3-Tier Aadhaar & Police Verification • 100% Digital Escrow • Wearable Emergency SOS • Tamper-Sealed Chain of Custody."}</p>

        <div class="footer">
          <p>${isHi ? "गोपनीय • स्टैशसारथी टीम • संपर्क: connect@stashsaarthi.in • व्हाट्सएप: +91 9369454350" : "Confidential • StashSaarthi Team • Contact: connect@stashsaarthi.in • Founder WhatsApp: +91 9369454350"}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(memoContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
};
