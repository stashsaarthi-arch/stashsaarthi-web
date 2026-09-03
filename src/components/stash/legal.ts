export const dispatchNavTab = (type: "solution" | "calculator" | "trust", tab: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`stashsaarthi-${type}-tab`, { detail: tab }));
  }
};

export const smoothScrollTo =
  (id: string, offset = -75) =>
  (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!id || typeof window === "undefined") return;

    let targetId = id.replace(/^#/, "");

    // Handle Top
    if (targetId === "top" || id === "top" || !targetId) {
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, {
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return;
    }

    // Deep sub-tab resolutions for Solutions Hub
    if (targetId === "stash" || targetId === "storage" || targetId === "ecosystem") {
      dispatchNavTab("solution", "stash");
      targetId = "solutions";
    } else if (targetId === "rooms" || targetId === "spaces") {
      dispatchNavTab("solution", "rooms");
      targetId = "solutions";
    } else if (targetId === "kitchen" || targetId === "tiffin" || targetId === "food") {
      dispatchNavTab("solution", "kitchen");
      targetId = "solutions";
    } else if (targetId === "connect" || targetId === "senior-living") {
      dispatchNavTab("solution", "connect");
      targetId = "solutions";
    }

    // Deep sub-tab resolutions for Calculator Hub
    else if (targetId === "student-calculator" || targetId === "savings-calculator") {
      dispatchNavTab("calculator", "student");
      targetId = "calculator";
    } else if (
      targetId === "host-earnings-calculator" ||
      targetId === "host-simulator" ||
      targetId === "host-calculator"
    ) {
      dispatchNavTab("calculator", "host");
      targetId = "calculator";
    } else if (targetId === "calculator") {
      const role =
        typeof document !== "undefined" ? document.documentElement.dataset["role"] : "student";
      dispatchNavTab("calculator", role === "host" ? "host" : "student");
    }

    // Deep sub-tab resolutions for Trust Console
    else if (targetId === "custody-pass" || targetId === "sandbox") {
      dispatchNavTab("trust", "sandbox");
      targetId = "trust";
    } else if (targetId === "process" || targetId === "logistics") {
      dispatchNavTab("trust", "process");
      targetId = "trust";
    } else if (
      targetId === "safety" ||
      targetId === "safety-protocol" ||
      targetId === "zerorisk" ||
      targetId === "insurance"
    ) {
      dispatchNavTab("trust", "zerorisk");
      targetId = "trust";
    } else if (targetId === "privacy" || targetId === "sla") {
      dispatchNavTab("trust", "privacy");
      targetId = "trust";
    } else if (targetId === "founder" || targetId === "accountability" || targetId === "nodal") {
      dispatchNavTab("trust", "founder");
      targetId = "trust";
    } else if (targetId === "waitlist" || targetId === "waitlist-form") {
      targetId = "waitlist-form";
    }

    const performScroll = () => {
      const el = document.getElementById(targetId) || document.getElementById(id.replace(/^#/, ""));
      if (!el) return;

      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(el, {
          offset,
          duration: 1.0,
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

    // Small timeout ensures component state update / DOM render if sub-tab was just selected
    setTimeout(performScroll, 50);
  };

export type Doc = { title: string; title_hi?: string; body: string[]; body_hi?: string[] };

export const DOCS: Record<string, Doc> = {
  about: {
    title: "About us & Founding Mission",
    title_hi: "हमारे बारे में एवं संस्थापक मिशन",
    body: [
      "StashSaarthi is India's hyper-local living ecosystem, founded in Kanpur by Advik Omer to bridge student mobility with intergenerational community support.",
      "We replace predatory brokerages and wasteful dead-rent with verified peer-to-peer micro-storage (₹300/bag/mo), broker-free student rooms (avg ₹5,500/mo), and pure homestyle tiffins inside verified senior households.",
      "Our platform operates with software discipline and on-ground human accountability: 3-tier background verification, tamper-evident laser barcode seals, and 100% digital bank escrow.",
    ],
    body_hi: [
      "स्टैशसारथी भारत का हाइपर-लोकल लिविंग इकोसिस्टम है, जिसे कानपुर में अद्विक ओमर द्वारा छात्र गतिशीलता को अंतर-पीढ़ी सामुदायिक समर्थन से जोड़ने के लिए स्थापित किया गया।",
      "हम भारी ब्रोकरेज और खाली कमरों के डेड-रेंट को समाप्त कर सत्यापित बुजुर्गों के घरों में माइक्रो-स्टोरेज (₹300/बैग/माह), शून्य-ब्रोकरेज कमरे (औसत ₹5,500/माह) और घर का शुद्ध भोजन उपलब्ध कराते हैं।",
      "हमारा प्लेटफॉर्म सॉफ्टवेयर अनुशासन और ज़मीनी मानवीय जवाबदेही पर काम करता है: 3-स्तरीय सत्यापन, लेजर बारकोड सील और 100% डिजिटल बैंक एस्क्रो।",
    ],
  },
  privacy: {
    title: "Privacy Policy (Plain English)",
    title_hi: "गोपनीयता नीति (सरल भाषा में)",
    body: [
      "1. Zero Data Monetization: We never sell, rent, lease, or distribute your phone number, email, or identity documents to third parties, telemarketers, or advertising networks.",
      "2. Purpose of Collection: We collect only the data required to facilitate safe node custody and booking clearance (Name, College/Aadhaar proof, and campus location).",
      "3. Encryption & Storage: All personal records are encrypted at rest and in transit. Temporary check-in photo logs are retained only during the active custody period.",
      "4. Right to Erasure: You have full ownership of your data and can request permanent account and document deletion at any time by emailing privacy@stashsaarthi.in.",
    ],
    body_hi: [
      "1. शून्य डेटा बिक्री: हम आपके फोन नंबर, ईमेल या पहचान दस्तावेजों को कभी किसी तीसरे पक्ष, टेलीमार्केटर या विज्ञापन नेटवर्क को नहीं बेचते या साझा नहीं करते।",
      "2. संग्रह का उद्देश्य: हम केवल सुरक्षित नोड कस्टडी और बुकिंग सत्यापन के लिए आवश्यक डेटा (नाम, कॉलेज/आधार प्रमाण और स्थान) एकत्र करते हैं।",
      "3. एन्क्रिप्शन एवं सुरक्षा: सभी व्यक्तिगत रिकॉर्ड पूर्णतः एन्क्रिप्टेड होते हैं। चेक-इन फोटो लॉग केवल सक्रिय स्टोरेज अवधि के दौरान ही सुरक्षित रखे जाते हैं।",
      "4. डेटा विलोपन का अधिकार: आपको अपने डेटा पर पूर्ण नियंत्रण है और आप किसी भी समय privacy@stashsaarthi.in पर लिखकर अपने रिकॉर्ड हटाने का अनुरोध कर सकते हैं।",
    ],
  },
  terms: {
    title: "Terms of Service & Code of Conduct",
    title_hi: "सेवा की शर्तें एवं आचार संहिता",
    body: [
      "1. Lawful & Transparent Use: Users must provide truthful identity details. Misrepresentation of student status or property details results in immediate termination.",
      "2. Prohibited Storage Items: Stashed luggage must not contain cash, currency notes, gold jewelry, perishable food, flammable items, or unlawful substances.",
      "3. Legal Protection under TPA 1882: Room stays operate under valid leave-and-license agreements governed by Section 105 of the Transfer of Property Act 1882.",
      "4. Escrow Protection: Payouts to hosts are released on a weekly schedule only after satisfactory custody confirmation and conflict-free handover.",
    ],
    body_hi: [
      "1. वैध एवं पारदर्शी उपयोग: उपयोगकर्ताओं को सत्य पहचान विवरण प्रदान करना होगा। छात्र स्थिति या संपत्ति विवरण का गलत प्रतिनिधित्व करने पर खाता तुरंत निलंबित कर दिया जाएगा।",
      "2. प्रतिबंधित वस्तुएं: संग्रहीत सामान में नकद, सोने के आभूषण, खराब होने वाली खाद्य सामग्री, ज्वलनशील पदार्थ या अवैध वस्तुएं रखना सख्त वर्जित है।",
      "3. संपत्ति अधिनियम (TPA 1882) के तहत कानूनी सुरक्षा: कमरे के प्रवास संपत्ति अधिनियम 1882 की धारा 105 के तहत वैध लाइसेंस समझौते के रूप में संचालित होते हैं।",
      "4. एस्क्रो सुरक्षा: होस्ट को भुगतान साप्ताहिक आधार पर केवल सुरक्षित कस्टडी और विवाद-मुक्त हैंडओवर की पुष्टि के बाद ही जारी किया जाता है।",
    ],
  },
  refund: {
    title: "Cancellation & Fair Usage Policy",
    title_hi: "रद्दीकरण एवं उचित उपयोग नीति",
    body: [
      "1. 100% Pre-Pickup Refund: Cancellations made up to 24 hours prior to scheduled doorstep luggage pickup or stay move-in receive a full, instant 100% refund with zero penalty fees.",
      "2. Pro-Rata Mid-Cycle Return: If you return to campus early and withdraw stored luggage mid-cycle, unused whole months are refunded directly to your original payment method.",
      "3. Zero Hidden Processing Charges: We do not deduct hidden processing or convenience fees on eligible refunds. Funds reflect in your bank account within 3–5 working days.",
    ],
    body_hi: [
      "1. पिकअप पूर्व 100% रिफंड: निर्धारित पिकअप या चेक-इन से 24 घंटे पहले रद्दीकरण पर बिना किसी कटौती के 100% पूर्ण रिफंड प्रदान किया जाता है।",
      "2. समय से पहले वापसी पर आनुपातिक रिफंड: यदि आप कैंपस जल्दी लौटते हैं और बीच में सामान वापस लेते हैं, तो पूरे अप्रयुक्त महीनों का पैसा सीधे वापस कर दिया जाता है।",
      "3. शून्य छुपे शुल्क: हम किसी भी तरह का कैंसिलेशन शुल्क या कन्वीनियंस चार्ज नहीं काटते। रिफंड 3-5 कार्य दिवसों में आपके बैंक खाते में जमा हो जाता है।",
    ],
  },
  liability: {
    title: "Storage Liability & ₹10k Insurance Charter",
    title_hi: "स्टोरेज सुरक्षा व ₹10,000 बीमा चार्टर",
    body: [
      "1. Embedded Micro-Insurance: Every verified luggage bag sealed with our laser barcode is covered with up to ₹10,000 against physical damage, moisture, or theft.",
      "2. Raised Platform Mandate: All host nodes are physically audited to ensure luggage is stored on elevated wooden/polymer pallets (min 2.5 ft elevation) in dry, clean zones.",
      "3. Unbroken Seal Warranty: If a tamper seal is reported broken upon return handover, an immediate escalation ticket is raised and compensation is settled within 48 hours.",
    ],
    body_hi: [
      "1. गारंटीकृत माइक्रो-बीमा: हमारे लेजर बारकोड से सील किए गए प्रत्येक बैग को भौतिक क्षति, नमी या चोरी के विरुद्ध ₹10,000 तक का सुरक्षा कवर प्राप्त है।",
      "2. ऊंचा स्टोरेज प्लेटफॉर्म: सभी होस्ट नोड्स का भौतिक निरीक्षण किया जाता है ताकि सामान जमीन से कम से कम 2.5 फीट ऊंचे सूखे लकड़ी के पैलेट पर रखा जाए।",
      "3. अक्षुण्ण सील गारंटी: यदि वापसी पर बारकोड सील टूटी पाई जाती है, तो तत्काल जांच शुरू होती है और 48 घंटे के भीतर मुआवजे का निपटारा किया जाता है।",
    ],
  },
  grievance: {
    title: "Direct Grievance & Nodal Officer Details",
    title_hi: "शिकायत निवारण एवं नोडल अधिकारी संपर्क",
    body: [
      "Nodal Grievance Officer: Advik Omer (Founder & Operations Lead)",
      "Physical Operational Hub: 117/K-Block, Kalyanpur, Kanpur, Uttar Pradesh — 208016, India",
      "Direct Escalation Email: stashsaarthi@gmail.com | Direct Founder Line: +91 9369454350",
      "Response Commitment: All official grievances acknowledged within 4 hours; full resolution guaranteed within 24 hours.",
    ],
    body_hi: [
      "नोडल शिकायत अधिकारी: अद्विक ओमर (संस्थापक एवं ऑपरेशंस प्रमुख)",
      "भौतिक परिचालन कार्यालय: 117/के-ब्लॉक, कल्याणपुर, कानपुर, उत्तर प्रदेश — 208016, भारत",
      "सीधी ईमेल: stashsaarthi@gmail.com | डायरेक्ट फाउंडर फोन लाइन: +91 9369454350",
      "प्रतिक्रिया प्रतिबद्धता: सभी आधिकारिक शिकायतों का 4 घंटे में संज्ञान लिया जाता है और 24 घंटे में पूर्ण समाधान सुनिश्चित किया जाता है।",
    ],
  },
  micro: {
    title: "Micro-Opportunity for Senior Hosts",
    title_hi: "सीनियर होस्ट्स के लिए माइक्रो-अवसर",
    body: [
      "Every verified senior host, home chef, and stash keeper earns a recurring, dignified micro-income from existing unused home assets.",
      "A single spare bedroom, 4 square feet of raised corner storage, or 4 daily homestyle tiffins can generate ₹3,000–₹12,000 monthly with zero capital expenditure.",
      "Our Kanpur ground team provides free space measurement, digital setup, and weekly direct bank payouts.",
    ],
    body_hi: [
      "प्रत्येक सत्यापित सीनियर होस्ट, होम शेफ और स्टैश कीपर अपने घर की मौजूदा खाली जगह से नियमित सम्मानजनक आय अर्जित करते हैं।",
      "एक खाली कमरा, 4 वर्ग फुट का ऊंचा कोना या 4 रोजाना टिफिन बिना किसी निवेश के हर महीने ₹3,000–₹12,000 तक की आय दे सकते हैं।",
      "हमारी कानपुर टीम मुफ्त जगह माप, डिजिटल सेटअप और साप्ताहिक सीधे बैंक भुगतान में पूरी मदद करती है।",
    ],
  },
  partner: {
    title: "Partner with Us (Campus & RWA)",
    title_hi: "हमारे साथ साझेदारी करें",
    body: [
      "We collaborate with Resident Welfare Associations (RWAs), campus clubs, student unions, and local logistics teams in Kanpur, Lucknow, and Delhi NCR.",
      "Partners receive access to verified student demand, our deterministic chain-of-custody framework, and transparent revenue-sharing models.",
      "Submit an inquiry or message our founder directly on WhatsApp (+91 9369454350) for collaboration.",
    ],
    body_hi: [
      "हम कानपुर, लखनऊ और दिल्ली एनसीआर में रेजिडेंट वेलफेयर एसोसिएशनों (RWAs), कॉलेज क्लबों और छात्र संघों के साथ सहयोग करते हैं।",
      "पार्टनर्स को सत्यापित छात्र मांग, हमारा कस्टडी फ्रेमवर्क और पारदर्शी राजस्व-साझाकरण प्राप्त होता है।",
      "साझेदारी के लिए सीधे हमारे व्हाट्सएप (+91 9369454350) पर संपर्क करें।",
    ],
  },
  careers: {
    title: "Careers & Culture",
    title_hi: "करियर एवं कार्य संस्कृति",
    body: [
      "We are a high-ownership, lean team building real-world physical infrastructure backed by software discipline.",
      "Open areas: Hyper-local ground operations, trust & safety inspection, community growth, and full-stack engineering.",
      "If you care about radical transparency and building meaningful physical products in India, email your note to stashsaarthi@gmail.com.",
    ],
    body_hi: [
      "हम एक केंद्रित और उच्च-स्वामित्व वाली टीम हैं जो सॉफ्टवेयर अनुशासन के साथ वास्तविक भौतिक बुनियादी ढांचा तैयार कर रही है।",
      "खुले क्षेत्र: हाइपर-लोकल ग्राउंड ऑपरेशंस, सुरक्षा निरीक्षण, कम्युनिटी ग्रोथ और फुल-स्टैक इंजीनियरिंग।",
      "यदि आप पारदर्शिता और सार्थक प्रभाव में विश्वास रखते हैं, तो अपना परिचय stashsaarthi@gmail.com पर भेजें।",
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
          <p>${isHi ? "गोपनीय • स्टैशसारथी टीम • संपर्क: stashsaarthi@gmail.com • व्हाट्सएप: +91 9369454350" : "Confidential • StashSaarthi Team • Contact: stashsaarthi@gmail.com • Founder WhatsApp: +91 9369454350"}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(memoContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
};
