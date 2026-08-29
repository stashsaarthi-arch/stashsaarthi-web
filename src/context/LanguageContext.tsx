import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type Language = "en" | "hi";

export const translations = {
  en: {
    nav: {
      ecosystem: "Ecosystem Nodes",
      rooms: "Verified Rooms",
      stash: "Storage Calculator",
      connect: "Saarthi Connect",
      trust: "Safety Infrastructure",
      studentToggle: "🟢 Student: Save ₹6,400",
      hostToggle: "🟡 Host: Earn ₹11,500",
      listRoom: "List room · ₹200",
      explore: "Explore Ecosystem",
      auth: "Continue with Google",
      savingsCalc: "Savings Calculator",
      earningSim: "Earning Simulator",
      safetyProto: "Safety Protocol",
      listSpace: "List Space",
    },
    hero: {
      student: {
        badge: "🚨 The 20-Day Vacation Scam Costing Indian Students ₹4,000–₹8,000",
        title: "Why Are You Paying ₹8,000 Rent for an Empty Room and Locked Bags?",
        subtitle: "Semester break? Internship shift? Stop burning money. Stash your luggage for ₹300/mo, get broker-free student rooms, and eat pure homestyle tiffins — hosted by verified local elders.",
        cta: "Store Luggage @ ₹300/mo",
        secondaryCta: "Explore Verified Co-Living",
        stats: [
          { label: "Brokerage Free", value: "100%" },
          { label: "Verified", value: "3-Tier" },
          { label: "Spaces Mapped", value: "1k+" },
          { label: "Stash From", value: "₹300" },
        ],
      },
      host: {
        badge: "Trusted by 1,200+ Senior Hosts Across India",
        title: "Turn Silent Rooms & Empty Corners Into ₹11,500/Month With Zero Lifestyle Disturbance.",
        subtitle: "No commercial chaos. No intrusive brokers. Host verified students for safe luggage storage, family-like stays, or home-cooked meals — backed by 100% upfront digital escrow and strict house norms.",
        cta: "Request a Free Home Visit & Space Measurement",
        secondaryCta: "Chat Directly on WhatsApp",
        stats: [
          { label: "Zero-Damage Guarantee", value: "₹10,000" },
          { label: "Aadhaar & Police-Checked", value: "100% Verified" },
          { label: "Guaranteed Bank Payouts", value: "Weekly" },
          { label: "Daily Effort (Storage)", value: "0 Hrs" },
        ],
      }
    },
    campusNodeChecker: {
      liveNetwork: "Live Network",
      placeholder: "Enter Campus, Area, or 6-Digit PIN (e.g. 208016, IITK, Kakadeo)...",
      popularHubs: "Popular Student Hubs",
      scanning: "Scanning local network...",
      walkSuffix: "walk",
      hostZone: "Host Nodal Zone",
      pinPrefix: "PIN",
      lockersLeft: "Lockers Left",
      roomsLeft: "Rooms Left",
      pickupSuffix: "Pickup",
      reserveBtn: "Reserve at Node",
      viewMap: "View Map Route",
      noResults: "No live node found for this search. Try searching 208016, IIT Kanpur, or Kalyanpur.",
    },
    roleLane: {
      student: {
        eyebrow: "Student Lane",
        title: "Move light. Live cheap. Eat home.",
        blurb: "Built for hostel exits, semester breaks and internship shifts — store what you own, land a broker-free room and never miss a home-cooked meal.",
        cta: "Start with ₹300/mo storage",
        steps: [
          { title: "Stash your bags", text: "Doorstep pickup, sealed bins, insured storage from ₹300/month." },
          { title: "Book a verified room", text: "Zero brokerage rooms inside senior-hosted homes near campus." },
          { title: "Subscribe to tiffins", text: "Home-cooked meals from the same neighbourhood kitchens." },
        ],
        metrics: [
          { label: "Avg. monthly saving", value: "₹6,400" },
          { label: "Pickup window", value: "4 hrs" },
          { label: "Insured bags", value: "100%" },
        ],
      },
      host: {
        eyebrow: "Elderly Host Lane",
        title: "Earn from the room. Keep the company.",
        blurb: "Your spare room becomes steady income and daily companionship — we screen every student, handle paperwork and stay on call for you.",
        cta: "List your spare room free",
        steps: [
          { title: "List the spare room", text: "Our concierge visits, photographs and prices it for you." },
          { title: "We screen the student", text: "3-tier ID, campus and family verification before any visit." },
          { title: "Match on companionship", text: "Paired on routine, language and interests — not just rent." },
        ],
        metrics: [
          { label: "Avg. monthly income", value: "₹11,500" },
          { label: "Hosts onboarded", value: "1,200+" },
          { label: "Concierge support", value: "24×7" },
        ],
        simulator: {
          title: "Passive Income Simulator",
          selectSpace: "Select Spare Space",
          corner: "Corner",
          verandah: "Verandah",
          fullRoom: "Full Room",
          cornerLabel: "Small Corner",
          verandahLabel: "Verandah / Balcony",
          roomLabel: "Full Spare Room",
        }
      }
    },
    crisis: {
      titlePart1: "The Harsh Reality vs. ",
      titlePart2: "The Saarthi Secret.",
      subtitle: "Tap Merge Solution to fuse both sides into a single living network.",
      studentTitle: "The Exploitative Cycle",
      hostTitle: "The StashSaarthi Ecosystem",
      studentPoints: [
        "The Broker Trap: Paying 1 month brokerage for a dingy room with fake photos.",
        "The Dead-Rent Tax: ₹8,000 burned during holidays just so your luggage doesn't get stolen.",
        "The Mess Nightmare: Watery daal, unhygienic oil, and homesickness.",
      ],
      hostPoints: [
        "Zero Brokerage: Direct connection to audited family and senior-hosted homes.",
        "Flat ₹300/mo Stash: Barcode-sealed, ₹10,000 insured vacation luggage storage.",
        "Ghar Ka Khana: Fresh micro-batch meals cooked by neighbourhood dadi/nani.",
      ],
      fusionComplete: "Fusion complete",
      fusionTitle: "The StashSaarthi Ecosystem",
      fusionPoints: [
        "Empty senior rooms become verified, brokerage-free student homes",
        "One hour a day of tech help & errands earns up to 60% rent subsidy",
        "Vacation luggage stays safe in a neighbourhood stash node at ₹300/mo",
        "Home-cooked meals replace mess food — cooked by the same community",
      ],
      mergeSolution: "Merge Solution",
      resetSplit: "Reset the split",
    },
    ecosystem: {
      titlePart1: "Two Generations.",
      titlePart2: "One Interconnected Ecosystem.",
      subtitle: "Bypass the predatory rental market entirely.",
      spaces: {
        badge: "100% Escrow Protected",
        title: "Saarthi Spaces",
        subtitle: "Verified senior-hosted homes and PGs.",
        price: "Avg ₹5,500/mo",
        comparison: "Flat 10% platform fee (zero brokerage)",
        bullets: ["3-Tier Verified Senior Family", "Free 24h Relocation Guarantee"]
      },
      stash: {
        badge: "Live Capacity: 24 Slots",
        title: "Saarthi Stash",
        subtitle: "Insured micro-storage in local homes.",
        price: "₹300/bag/mo",
        comparison: "Save ₹3,700 vs. paying dead room rent",
        bullets: ["Laser Tamper Seal", "₹10k Micro-Insurance", "24/7 Monitored Dry Space"]
      },
      kitchen: {
        badge: "Waitlist Only",
        title: "Saarthi Kitchen",
        subtitle: "Neighbourhood micro-batch tiffins.",
        price: "₹90/meal",
        comparison: "Zero palm oil, 100% hygienic home kitchen",
        bullets: ["₹2,400 / month for 1 daily meal", "Cooked by local families"]
      },
      connect: {
        badge: "Social Infrastructure",
        title: "Saarthi Connect",
        subtitle: "Rent subsidized by helping elders.",
        price: "Rent Subsidy",
        comparison: "Up to 60% offset on monthly stays",
        bullets: ["Tech support errands", "Intergenerational community building"]
      },
      trust: {
        badge: "3-tier verification",
        title: "Trust Infrastructure",
        subtitle: "Identity, background and physical audits.",
        price: "100% Free",
        comparison: "SOS button in every stay",
        bullets: ["Aadhaar + live biometric check", "Police & university verification"]
      },
      micro: {
        badge: "Local hosts & chefs",
        title: "Micro-Opportunity",
        subtitle: "Neighbourhood partners earn from the network.",
        price: "Avg ₹9,200",
        comparison: "Average monthly partner earning",
        bullets: ["Earn from unused rooms", "Weekly payouts"]
      }
    },
    calculator: {
      badge: "⚡ Live Savings Estimator",
      title: "Calculate Your Vacation Dead-Rent Waste",
      subtitle: "See how much money you save by choosing StashSaarthi instead of paying empty room rent.",
      bagsLabel: "Number of Bags / Cartons",
      vacationLabel: "Vacation / Break Duration",
      rentLabel: "Your Current Monthly Room Rent",
      bagUnit: "Bag",
      bagsUnit: "Bags",
      daysUnit: "Days",
      monthUnit: "mo",
      estimatedSavings: "Estimated In-Pocket Savings",
      saveCompare: "You save ~{percent}% compared to locking an empty room!",
      emptyRentBar: "Empty PG Room Rent:",
      stashCostBar: "StashSaarthi ({bags} bags):",
      lockSavings: "Lock This Saving Now",
      shareProof: "Share ₹{savings} Proof",
      packingGuide: "Packing Guide",
    },
    hostSimulator: {
      titlePart1: "Calculate Your",
      titlePart2: "Earning Potential",
      subtitle: "See how much you can earn by utilizing empty space and cooking meals.",
      effort: "Effort:",
      capacity: "Capacity:",
      space: "Space:",
      expectedIncome: "Expected Income",
      options: [
        {
          id: "corner",
          title: "Unused Corner / Wardrobe",
          space: "4x4 sq ft",
          effort: "0 mins/day",
          capacity: "10 Bags",
          incomeRange: "₹1,800/mo",
          tag: "Set & Forget (Vacation Micro-Storage)",
          floorplanTitle: "Luggage Floorplan:",
          floorplanFit: "10 Bags (100% Fit)",
          floorplanArea: "Area: 4ft × 4ft (16 sq.ft)",
          floorplanNet: "₹180/bag net",
        },
        {
          id: "bedroom",
          title: "Spare Bedroom",
          space: "10x10 sq ft",
          effort: "Companionship only",
          capacity: "1 Student Resident",
          incomeRange: "₹5,225/mo",
          tag: "Safe Intergenerational Stay",
        },
        {
          id: "kitchen",
          title: "Kitchen & Extra Meals",
          space: "Your Kitchen",
          effort: "Homestyle Cooking",
          capacity: "8 Daily Tiffins",
          incomeRange: "₹11,440/mo",
          tag: "Homestyle Dadi-Nani Meals",
          tiffinCountTitle: "Daily Tiffin Count:",
          tiffinMealsDay: "meals/day",
          payoutNote: "⚡ ₹55 host payout / meal (24 days/mo)",
        },
      ],
      annualTitle: "Projected Annual Household Income",
      perYear: "/ year",
      cta: "Become a Verified Host",
      viewPayoutCharter: "View Weekly Payout Charter",
    },
    rooms: {
      heading: "Browse",
      headingGradient: "Verified Student-Reviewed Rooms",
      subtitle: "Listed by departing students, reviewed honestly, connected directly to the owner. Zero brokerage.",
      filters: [
        { id: "all", label: "All Rooms" },
        { id: "proximity", label: "📍 Near Campus (< 10 min)" },
        { id: "iitk", label: "🎓 IIT Kanpur Belt" },
        { id: "csjmu", label: "🏢 CSJMU / Kalyanpur" },
        { id: "budget", label: "🏷️ Under ₹7,000/mo" },
        { id: "top-rated", label: "★ Highly Rated (4.5+)" },
      ],
      studentReviewedBadge: "✓ STUDENT REVIEWED • SAFETY VERIFIED",
      rentOnRequest: "Rent on request",
      perMonth: "/mo",
      bookDirectly: "Book directly",
      vacatingTitle: "Vacating your room?",
      vacatingDesc: "List it in 3 steps and earn ₹200 StashCredit toward your next storage booking.",
      listVacatingBtn: "List vacating room",
    },
    connectSection: {
      heading: "Built for Youth.",
      headingGradient: "Powered by Wisdom.",
      subtitle: "Pick a city and see a live student ↔ senior host pairing.",
      liveSimulation: "Live Simulation",
      compatibility: "Compatibility",
      gives: "Gives",
      offers: "Offers",
      requestMatch: "Request Match",
    },
    trustSection: {
      heading: "Trust is Our",
      headingGradient: "Core Infrastructure",
      subtitle: "Every host, student and space clears all three tiers before going live.",
      tiers: [
        {
          level: "Tier 01",
          title: "Aadhaar & Live Biometric Verification",
          points: ["Aadhaar-linked ID match", "Live biometric face check", "Address history trace"],
        },
        {
          level: "Tier 02",
          title: "Police Background & University Enrollment Check",
          points: ["Police background check", "University enrollment proof", "Reference call log"],
        },
        {
          level: "Tier 03",
          title: "On-Site Safety, CCTV & Hygiene Audit",
          points: ["Physical property inspection", "CCTV & lock audit", "Fire and hygiene checklist"],
        },
      ],
      verifiedBadge: "Verified Badge Issued",
      slaTitle: "24-Hour Relocation SLA",
      slaDescPart1: "In the rare event of a conflict, our rapid response team guarantees a ",
      slaDescBold: "zero-penalty relocation within 24 hours",
      slaDescPart2: " for both students and hosts. No questions asked.",
    },
    zeroRisk: {
      badge: "Zero-Risk Architecture",
      title: "How We Eliminate Every Conceivable Risk",
      subtitle: "Deterministic physical and financial safeguards engineered for complete peace of mind.",
      tabs: {
        matrix: "Risk Mitigation Matrix",
        tamperTool: "Smart Barcode Demo",
      },
      problemLabel: "Risk / Concern",
      mitigationsLabel: "Deterministic Mitigations",
      barcodeSimulator: {
        title: "Interactive Smart Barcode Seal Verification",
        subtitle: "Every stored bag is laser-sealed with a non-tearable serialized barcode at pickup.",
        scanTitle: "Scan Barcode Label",
        scanDesc: "Simulates app scanning upon handover at senior host home node.",
        scannedStatus: "Verified & Locked to Host Node #KNP-208016",
        simBtn: "Simulate Physical Seal Scan",
      }
    },
    hostRulesSection: {
      badge: "Host Dignity & Safety Charter",
      title: "You Are in",
      titleGradient: "100% Control",
      subtitle: "Design your custom House Norms Matrix. You decide who stays, what rules apply, and when you want your room back.",
      rules: [
        { title: "10:00 PM Main Gate Curfew", desc: "Host locks main exterior gate at night. No late night entry without prior written notice." },
        { title: "Zero Alcohol, Smoking & Unverified Guests", desc: "Strictly non-negotiable. Only registered student tenant allowed on premises." },
        { title: "Quiet Study Hours (10:00 PM – 7:00 AM)", desc: "Headphones required. No loud phone calls or musical instruments during sleeping hours." },
        { title: "Private Master Bedroom Smart-Locked", desc: "Elder master bedroom remains 100% private zone. Student restricted to designated room & common area." },
        { title: "Vegetarian / Respectful Kitchen Etiquette", desc: "Shared refrigerator & kitchen shelves clearly demarcated with strict cleanliness guidelines." },
      ],
      activeCounter: "of 5 Norms Active in Agreement",
      guaranteeTitle: "24-Hour Relocation Guarantee",
      guaranteeDesc: "If a student violates any active rule on your matrix, StashSaarthi's rapid ops fleet relocates them within 24 hours at zero loss of rent to you.",
      legalProtection: "Legal Waiver: Sec 105 TPA",
      hostProtected: "100% Host Protected",
      printBtn: "Print Host Norms Certificate",
    },
    familyDashboardSection: {
      badge: "Family Co-Pilot & Safety Charter",
      title: "For Sons & Daughters",
      titleGradient: "Living Away",
      subtitle: "Total peace of mind knowing your parents are safe, accompanied, and physically protected 24×7.",
      features: [
        { title: "Remote Family Dashboard", desc: "Live monitoring of verified student check-ins and ratings directly on your phone." },
        { title: "24/7 Rapid Emergency Response", desc: "1-Touch bedside SOS button linked to local nodal managers for immediate assistance." },
        { title: "Digital Companionship", desc: "Students assist with smartphone tech, medicine ordering, and light groceries." },
      ],
      sosTitle: "1-Touch Bedside Emergency SOS Simulator",
      sosSubtitle: "Simulate what happens when an elder presses their bedside safety button.",
      triggerBtn: "🔴 Trigger Live SOS Simulation",
      resetBtn: "Reset Emergency Simulator",
      stages: [
        { label: "Step 1", title: "Immediate App & Beacon Ping", desc: "Bedside beacon fires live geo-coordinates to local Kanpur nodal manager (0.4s)." },
        { label: "Step 2", title: "Student Roommate & Nodal Dispatch", desc: "Verified student in house alerted immediately; local manager dispatched (1.2s)." },
        { label: "Step 3", title: "Family Connected on WhatsApp", desc: "Son/daughter in Delhi/Bengaluru receives automatic audio call & live status (2.4s)." },
      ]
    },
    storiesSection: {
      badge: "Real Kanpur Experiences",
      title: "Loved by Students.",
      titleGradient: "Cherished by Elders.",
      subtitle: "Listen to real stories from student guests, senior hosts, and neighborhood cloud chefs.",
      filters: [
        { id: "all", label: "All" },
        { id: "students", label: "Students" },
        { id: "seniors", label: "Senior Hosts" },
        { id: "partners", label: "Partners" },
      ],
      playAudio: "Listen to Real Host Story",
      playingAudio: "Playing Audio Simulation...",
    },
    faqSection: {
      badge: "Common Queries",
      title: "Objection-Crushing Clarity",
      subtitle: "We know trust is earned. Here’s exactly how we handle the hard stuff.",
      searchPlaceholder: "Search questions (e.g. luggage safety, early retrieval, host payouts)...",
      categories: [
        { id: "all", label: "All Questions" },
        { id: "storage", label: "📦 Student Storage" },
        { id: "safety", label: "🛡️ Safety & Claims" },
        { id: "host", label: "🏡 Senior Host Norms" },
      ],
      noResults: "No matching questions found. You can ask our 24×7 concierge directly on WhatsApp.",
    },
    footer: {
      title: "A City Where No One Arrives Alone.",
      subtitle: "Join the priority list for your city — stash spots, verified rooms and home kitchens open in batches.",
      student: "Student",
      host: "Host",
      name: "Full name",
      email: "you@college.edu",
      phone: "+91 98xxx xxxxx",
      college: "College name",
      locality: "Locality / area",
      waiver: "I agree that stored luggage contains no prohibited/hazardous items as per StashSaarthi Safety Charter.",
      join: "Join the Waitlist",
      submit: "Join the Waitlist",
      or: "OR",
      continueWithGoogle: "Continue with Google",
      investorCTA: "Investor One-Pager",
      campusCaptainCTA: "Campus Captain (Earn ₹5k+)",
      copyright: "© 2026 StashSaarthi. All rights reserved. Illustrative pricing and listings shown for demonstration."
    }
  },
  hi: {
    nav: {
      ecosystem: "इकोसिस्टम नोड्स",
      rooms: "सत्यापित कमरे",
      stash: "स्टोरेज कैलकुलेटर",
      connect: "सार्थी कनेक्ट",
      trust: "सुरक्षा इंफ्रास्ट्रक्चर",
      studentToggle: "🟢 छात्र: ₹6,400 बचाएं",
      hostToggle: "🟡 होस्ट: ₹11,500 कमाएं",
      listRoom: "कमरा लिस्ट करें · ₹200",
      explore: "इकोसिस्टम देखें",
      auth: "Google से जारी रखें",
      savingsCalc: "बचत कैलकुलेटर",
      earningSim: "कमाई कैलकुलेटर",
      safetyProto: "सुरक्षा प्रोटोकॉल",
      listSpace: "कमरा लिस्ट करें",
    },
    hero: {
      student: {
        badge: "🚨 छुट्टियों में ₹8,000 का नुकसान उठाना बंद करें!",
        title: "खाली कमरे और बंद बैग के लिए आप ₹8,000 किराया क्यों दे रहे हैं?",
        subtitle: "सेमेस्टर ब्रेक? पैसा बर्बाद करना बंद करें। अपना सामान मात्र ₹300/महीने में रखें, बिना ब्रोकर के कमरे पाएं, और शुद्ध घरेलू टिफिन का आनंद लें।",
        cta: "₹300/महीने में सामान रखें",
        secondaryCta: "सत्यापित कमरे देखें",
        stats: [
          { label: "ब्रोकरेज फ्री", value: "100%" },
          { label: "सत्यापित", value: "3-Tier" },
          { label: "स्पेस मैप किए गए", value: "1k+" },
          { label: "स्टैश शुरू", value: "₹300" },
        ],
      },
      host: {
        badge: "पूरे भारत में 1,200+ सीनियर होस्ट्स का भरोसा",
        title: "अपने खाली कमरों और कोनों को बनाएं ₹11,500/महीने की सम्मानजनक आय का साधन — बिना किसी ब्रोकर या परेशानी के।",
        subtitle: "कोई कमर्शियल भीड़ नहीं। कोई ब्रोकर नहीं। सुरक्षित सामान रखने या छात्रों को ठहराने के लिए अपना कमरा दें - 100% एडवांस डिजिटल एस्क्रो और आपके घर के नियमों के साथ।",
        cta: "मुफ्त होम विजिट बुक करें",
        secondaryCta: "WhatsApp पर सीधे बात करें",
        stats: [
          { label: "नुकसान की गारंटी", value: "₹10,000" },
          { label: "आधार और पुलिस-चेक", value: "100% सत्यापित" },
          { label: "बैंक भुगतान", value: "साप्ताहिक" },
          { label: "दैनिक प्रयास", value: "0 घंटे" },
        ],
      }
    },
    campusNodeChecker: {
      liveNetwork: "लाइव नेटवर्क",
      placeholder: "कैंपस, क्षेत्र या 6-अंकों का पिन कोड डालें (जैसे 208016, IITK, काकादेव)...",
      popularHubs: "लोकप्रिय छात्र केंद्र",
      scanning: "स्थानीय नेटवर्क स्कैन हो रहा है...",
      walkSuffix: "पैदल",
      hostZone: "होस्ट नोडल ज़ोन",
      pinPrefix: "पिन",
      lockersLeft: "लॉकर उपलब्ध",
      roomsLeft: "कमरे उपलब्ध",
      pickupSuffix: "पिकअप",
      reserveBtn: "नोड पर स्लॉट बुक करें",
      viewMap: "गूगल मैप्स रूट देखें",
      noResults: "इस खोज के लिए कोई लाइव नोड नहीं मिला। 208016, आईआईटी कानपुर या कल्याणपुर खोजें।",
    },
    roleLane: {
      student: {
        eyebrow: "छात्र लेन",
        title: "हल्के चलें। कम खर्चें। घर का खाना खाएं।",
        blurb: "हॉस्टल खाली करने, छुट्टियों और इंटर्नशिप के लिए निर्मित — अपना सामान सुरक्षित रखें, बिना ब्रोकर के कमरा पाएं और घर का खाना कभी न छोड़ें।",
        cta: "₹300/माह स्टोरेज से शुरू करें",
        steps: [
          { title: "बैग सुरक्षित रखें", text: "घर से पिकअप, सीलबंद बैग, ₹10,000 बीमा सुरक्षित मात्र ₹300/माह में।" },
          { title: "सत्यापित कमरा पाएं", text: "कैंपस के पास वरिष्ठ नागरिकों के सुरक्षित घरों में शून्य ब्रोकरेज कमरे।" },
          { title: "घरेलू टिफिन लें", text: "उसी मोहल्ले की रसोई से तैयार शुद्ध व स्वच्छ घर का खाना।" },
        ],
        metrics: [
          { label: "औसत मासिक बचत", value: "₹6,400" },
          { label: "पिकअप समय", value: "4 घंटे" },
          { label: "बीमा सुरक्षित बैग", value: "100%" },
        ],
      },
      host: {
        eyebrow: "सीनियर होस्ट लेन",
        title: "खाली कमरे से कमाई करें। अकेलापन दूर भगाएं।",
        blurb: "आपका खाली कमरा बन जाता है नियमित आय और दैनिक साथ का जरिया — हम हर छात्र का बैकग्राउंड चेक करते हैं और पूरी जिम्मेदारी संभालते हैं।",
        cta: "खाली कमरा मुफ्त लिस्ट करें",
        steps: [
          { title: "खाली कमरा लिस्ट करें", text: "हमारी टीम आपके घर आकर फोटो लेगी और सही किराया तय करेगी।" },
          { title: "सत्यापित छात्र का चयन", text: "किसी भी विज़िट से पहले 3-स्तरीय आईडी, कॉलेज और पुलिस सत्यापन।" },
          { title: "साथ और सामंजस्य", text: "दैनिक दिनचर्या, भाषा और संस्कारों के आधार पर सुरक्षित मैचिंग।" },
        ],
        metrics: [
          { label: "औसत मासिक आय", value: "₹11,500" },
          { label: "होस्ट जुड़े", value: "1,200+" },
          { label: "सार्थी सहायता", value: "24×7" },
        ],
        simulator: {
          title: "पैसिव इनकम सिम्युलेटर",
          selectSpace: "खाली जगह चुनें",
          corner: "कोना",
          verandah: "बरामदा",
          fullRoom: "पूरा कमरा",
          cornerLabel: "छोटा कोना / अलमारी",
          verandahLabel: "बरामदा / बालकनी",
          roomLabel: "पूरा खाली कमरा",
        }
      }
    },
    crisis: {
      titlePart1: "कड़वी सच्चाई vs. ",
      titlePart2: "सार्थी सीक्रेट।",
      subtitle: "दोनों पक्षों को एक सिंगल लिविंग नेटवर्क में जोड़ने के लिए Merge Solution पर टैप करें।",
      studentTitle: "शोषणकारी चक्र",
      hostTitle: "स्टैश सार्थी इकोसिस्टम",
      studentPoints: [
        "ब्रोकर ट्रैप: फर्जी फोटो वाले छोटे से कमरे के लिए 1 महीने की ब्रोकरेज देना।",
        "डेड-रेंट टैक्स: केवल सामान सुरक्षित रखने के लिए छुट्टियों में ₹8,000 बर्बाद करना।",
        "मेस का दुःस्वप्न: पानी वाली दाल, अस्वच्छ तेल, और घर की याद।",
      ],
      hostPoints: [
        "जीरो ब्रोकरेज: सत्यापित परिवारों और वरिष्ठ नागरिकों के घरों से सीधा संपर्क।",
        "फ्लैट ₹300/महीना स्टैश: बारकोड सील, ₹10,000 बीमा सुरक्षित सामान।",
        "घर का खाना: पड़ोस की दादी/नानी द्वारा बनाया गया ताजा खाना।",
      ],
      fusionComplete: "फ्यूजन पूरा हुआ",
      fusionTitle: "स्टैश सार्थी इकोसिस्टम",
      fusionPoints: [
        "खाली कमरे अब सत्यापित, ब्रोकरेज-फ्री छात्र आवास बन गए हैं",
        "मदद करने पर किराए में 60% तक की छूट",
        "छुट्टियों में सामान सुरक्षित पड़ोस के स्टैश नोड में ₹300/महीने पर",
        "मेस के खाने की जगह घर का बना खाना — उसी समुदाय द्वारा पकाया गया",
      ],
      mergeSolution: "समाधान मिलाएं",
      resetSplit: "रीसेट करें",
    },
    ecosystem: {
      titlePart1: "दो पीढ़ियां।",
      titlePart2: "एक जुड़ा हुआ इकोसिस्टम।",
      subtitle: "किराये के बाजार की लूट से पूरी तरह बचें।",
      spaces: {
        badge: "100% एस्क्रो सुरक्षित",
        title: "सार्थी स्पेस",
        subtitle: "सत्यापित सीनियर होस्टेड घर और पीजी।",
        price: "औसत ₹5,500/महीना",
        comparison: "फ्लैट 10% प्लेटफॉर्म फीस (जीरो ब्रोकरेज)",
        bullets: ["3-Tier सत्यापित सीनियर परिवार", "24 घंटे में फ्री रीलोकेशन गारंटी"]
      },
      stash: {
        badge: "लाइव कैपेसिटी: 24 स्लॉट",
        title: "सार्थी स्टैश",
        subtitle: "स्थानीय घरों में बीमा सुरक्षित माइक्रो-स्टोरेज।",
        price: "₹300/बैग/महीना",
        comparison: "खाली कमरे के किराए की तुलना में ₹3,700 बचाएं",
        bullets: ["लेजर टैम्पर सील", "₹10,000 माइक्रो-इंश्योरेंस", "24/7 निगरानी वाला सूखा स्थान"]
      },
      kitchen: {
        badge: "केवल वेटलिस्ट",
        title: "सार्थी किचन",
        subtitle: "पड़ोस के माइक्रो-बैच टिफिन।",
        price: "₹90/भोजन",
        comparison: "जीरो पाम ऑयल, 100% स्वच्छ घरेलू किचन",
        bullets: ["₹2,400 / महीने में 1 दैनिक भोजन", "स्थानीय परिवारों द्वारा पकाया गया"]
      },
      connect: {
        badge: "सामाजिक इंफ्रास्ट्रक्चर",
        title: "सार्थी कनेक्ट",
        subtitle: "बुजुर्गों की मदद करके किराए में सब्सिडी।",
        price: "किराया सब्सिडी",
        comparison: "मासिक किराए पर 60% तक की छूट",
        bullets: ["तकनीकी सहायता", "अंतर-पीढ़ी समुदाय निर्माण"]
      },
      trust: {
        badge: "3-टियर सत्यापन",
        title: "ट्रस्ट इंफ्रास्ट्रक्चर",
        subtitle: "पहचान, पृष्ठभूमि और भौतिक ऑडिट।",
        price: "100% फ्री",
        comparison: "हर स्टे में एसओएस बटन",
        bullets: ["आधार + बायोमेट्रिक चेक", "पुलिस और विश्वविद्यालय सत्यापन"]
      },
      micro: {
        badge: "स्थानीय होस्ट और शेफ",
        title: "माइक्रो-अवसर",
        subtitle: "पड़ोसी नेटवर्क से कमाते हैं।",
        price: "औसत ₹9,200",
        comparison: "औसत मासिक पार्टनर आय",
        bullets: ["खाली कमरों से कमाएं", "साप्ताहिक भुगतान"]
      }
    },
    calculator: {
      badge: "⚡ लाइव बचत कैलकुलेटर",
      title: "छुट्टियों में खाली कमरे के किराए की बर्बादी की गणना करें",
      subtitle: "देखें कि खाली कमरे का किराया देने के बजाय स्टैशसारथी चुनकर आप कितने पैसे बचाते हैं।",
      bagsLabel: "बैग / कार्टन की संख्या",
      vacationLabel: "छुट्टियों / ब्रेक की अवधि",
      rentLabel: "आपका वर्तमान मासिक कमरा किराया",
      bagUnit: "बैग",
      bagsUnit: "बैग",
      daysUnit: "दिन",
      monthUnit: "माह",
      estimatedSavings: "अनुमानित कुल बचत",
      saveCompare: "खाली कमरे को बंद रखने की तुलना में आप ~{percent}% बचाते हैं!",
      emptyRentBar: "खाली पीजी कमरे का किराया:",
      stashCostBar: "स्टैशसारथी ({bags} बैग):",
      lockSavings: "यह बचत अभी सुरक्षित करें",
      shareProof: "₹{savings} बचत शेयर करें",
      packingGuide: "पैकिंग गाइड",
    },
    hostSimulator: {
      titlePart1: "अपनी",
      titlePart2: "कमाई की क्षमता जानें",
      subtitle: "देखें कि खाली जगह और भोजन पकाने से आप कितना कमा सकते हैं।",
      effort: "प्रयास:",
      capacity: "क्षमता:",
      space: "स्थान:",
      expectedIncome: "अनुमानित मासिक आय",
      options: [
        {
          id: "corner",
          title: "खाली कोना / अलमारी",
          space: "4x4 वर्ग फुट",
          effort: "0 मिनट/दिन",
          capacity: "10 बैग",
          incomeRange: "₹1,800/माह",
          tag: "निश्चिंत पैसिव इनकम (वेकेशन माइक्रो-स्टोरेज)",
          floorplanTitle: "सामान रखने का नक्शा:",
          floorplanFit: "10 बैग (100% सुरक्षित फिट)",
          floorplanArea: "क्षेत्रफल: 4ft × 4ft (16 वर्ग फुट)",
          floorplanNet: "₹180/बैग नेट",
        },
        {
          id: "bedroom",
          title: "खाली कमरा",
          space: "10x10 वर्ग फुट",
          effort: "केवल पारिवारिक साथ",
          capacity: "1 छात्र निवासी",
          incomeRange: "₹5,225/माह",
          tag: "सुरक्षित अंतर-पीढ़ी आवास",
        },
        {
          id: "kitchen",
          title: "रसोई और अतिरिक्त भोजन",
          space: "आपकी रसोई",
          effort: "घर का शुद्ध खाना",
          capacity: "8 दैनिक टिफिन",
          incomeRange: "₹11,440/माह",
          tag: "दादी-नानी के हाथ का स्वाद",
          tiffinCountTitle: "दैनिक टिफिन संख्या:",
          tiffinMealsDay: "भोजन/दिन",
          payoutNote: "⚡ ₹55 प्रति भोजन होस्ट भुगतान (24 दिन/माह)",
        },
      ],
      annualTitle: "अनुमानित वार्षिक घरेलू आय",
      perYear: "/ वर्ष",
      cta: "सत्यापित होस्ट बनें",
      viewPayoutCharter: "साप्ताहिक भुगतान चार्टर देखें",
    },
    rooms: {
      heading: "ब्राउज़ करें",
      headingGradient: "सत्यापित छात्र-समीक्षित कमरे",
      subtitle: "जाने वाले छात्रों द्वारा लिस्टेड, ईमानदारी से समीक्षित, सीधे मालिक से संपर्क। शून्य ब्रोकरेज।",
      filters: [
        { id: "all", label: "सभी कमरे" },
        { id: "proximity", label: "📍 कैंपस के पास (< 10 मिनट)" },
        { id: "iitk", label: "🎓 आईआईटी कानपुर बेल्ट" },
        { id: "csjmu", label: "🏢 सीएसजेएमयू / कल्याणपुर" },
        { id: "budget", label: "🏷️ ₹7,000/माह से कम" },
        { id: "top-rated", label: "★ उच्चतम रेटेड (4.5+)" },
      ],
      studentReviewedBadge: "✓ छात्र समीक्षित • सुरक्षा सत्यापित",
      rentOnRequest: "अनुरोध पर किराया",
      perMonth: "/माह",
      bookDirectly: "सीधे बुक करें",
      vacatingTitle: "कमरा खाली कर रहे हैं?",
      vacatingDesc: "इसे 3 चरणों में लिस्ट करें और अपनी अगली स्टोरेज बुकिंग पर ₹200 स्टैशक्रेडिट पाएं।",
      listVacatingBtn: "खाली हो रहा कमरा लिस्ट करें",
    },
    connectSection: {
      heading: "युवाओं के लिए निर्मित।",
      headingGradient: "अनुभव और आशीर्वाद से संचालित।",
      subtitle: "एक शहर चुनें और लाइव छात्र ↔ वरिष्ठ होस्ट जोड़ी देखें।",
      liveSimulation: "लाइव सिमुलेशन",
      compatibility: "सुसंगतता",
      gives: "देता है",
      offers: "प्रदान करते हैं",
      requestMatch: "मैच अनुरोध भेजें",
    },
    trustSection: {
      heading: "विश्वास ही हमारा",
      headingGradient: "मूल इंफ्रास्ट्रक्चर है",
      subtitle: "हर होस्ट, छात्र और स्थान लाइव होने से पहले तीनों स्तरों को पास करता है।",
      tiers: [
        {
          level: "टियर 01",
          title: "आधार एवं लाइव बायोमेट्रिक सत्यापन",
          points: ["आधार-लिंक्ड आईडी मिलान", "लाइव बायोमेट्रिक फेस चेक", "पता इतिहास की जांच"],
        },
        {
          level: "टियर 02",
          title: "पुलिस पृष्ठभूमि एवं विश्वविद्यालय नामांकन जांच",
          points: ["पुलिस पृष्ठभूमि सत्यापन", "विश्वविद्यालय नामांकन प्रमाण", "रेफरेंस कॉल लॉग"],
        },
        {
          level: "टियर 03",
          title: "ऑन-साइट सुरक्षा, सीसीटीवी एवं स्वच्छता ऑडिट",
          points: ["भौतिक संपत्ति निरीक्षण", "सीसीटीवी और ताला ऑडिट", "अग्नि और स्वच्छता चेकलिस्ट"],
        },
      ],
      verifiedBadge: "सत्यापित बैज जारी",
      slaTitle: "24-घंटे रीलोकेशन गारंटी (SLA)",
      slaDescPart1: "किसी भी असहमति की दुर्लभ स्थिति में, हमारी त्वरित प्रतिक्रिया टीम ",
      slaDescBold: "24 घंटे के भीतर बिना किसी जुर्माने के रीलोकेशन",
      slaDescPart2: " की गारंटी देती है। बिना किसी सवाल के।",
    },
    zeroRisk: {
      badge: "शून्य-जोखिम आर्किटेक्चर",
      title: "हम हर संभावित जोखिम को कैसे समाप्त करते हैं",
      subtitle: "पूर्ण मानसिक शांति के लिए इंजीनियर की गई भौतिक और वित्तीय सुरक्षा व्यवस्था।",
      tabs: {
        matrix: "जोखिम निवारण मैट्रिक्स",
        tamperTool: "स्मार्ट बारकोड डेमो",
      },
      problemLabel: "जोखिम / चिंता",
      mitigationsLabel: "निवारण उपाय",
      barcodeSimulator: {
        title: "इंटरएक्टिव स्मार्ट बारकोड सील सत्यापन",
        subtitle: "पिकअप के समय हर संग्रहीत बैग को लेजर-उत्कीर्ण गैर-फाड़ने योग्य बारकोड से सील किया जाता है।",
        scanTitle: "बारकोड लेबल स्कैन करें",
        scanDesc: "सीनियर होस्ट होम नोड पर हैंडओवर के समय ऐप स्कैनिंग का अनुकरण करता है।",
        scannedStatus: "सत्यापित एवं होस्ट नोड #KNP-208016 पर लॉक किया गया",
        simBtn: "भौतिक सील स्कैन का अनुकरण करें",
      }
    },
    hostRulesSection: {
      badge: "होस्ट गरिमा एवं सुरक्षा चार्टर",
      title: "आपका नियंत्रण",
      titleGradient: "100% आपके हाथ में",
      subtitle: "अपने घर के अनुसार नियम बनाएं। आप तय करते हैं कि कौन रहेगा, क्या नियम लागू होंगे और कब आपको कमरा वापस चाहिए।",
      rules: [
        { title: "रात 10:00 बजे मुख्य द्वार बंद", desc: "होस्ट रात में मुख्य गेट बंद करते हैं। पूर्व सूचना के बिना देर रात प्रवेश की अनुमति नहीं है।" },
        { title: "शराब, धूम्रपान और अनजान मेहमान पूर्णतः वर्जित", desc: "सख्ती से अनिवार्य नियम। परिसर में केवल पंजीकृत छात्र किराएदार को ही अनुमति है।" },
        { title: "शांत अध्ययन समय (रात 10:00 – सुबह 7:00)", desc: "हेडफोन आवश्यक। सोने के समय तेज आवाज में फोन कॉल या संगीत की अनुमति नहीं।" },
        { title: "निजी मास्टर बेडरूम स्मार्ट-लॉक्ड", desc: "बुजुर्गों का मुख्य कमरा 100% निजी रहता है। छात्र केवल अपने कमरे व साझा क्षेत्र तक सीमित हैं।" },
        { title: "शाकाहारी / स्वच्छ रसोई शिष्टाचार", desc: "साझा रेफ्रिजरेटर और अलमारी स्पष्ट रूप से स्वच्छता दिशानिर्देशों के साथ विभाजित हैं।" },
      ],
      activeCounter: "में से 5 नियम समझौते में सक्रिय",
      guaranteeTitle: "24-घंटे रीलोकेशन गारंटी",
      guaranteeDesc: "यदि कोई छात्र आपके किसी भी सक्रिय नियम का उल्लंघन करता है, तो सार्थी टीम 24 घंटे के भीतर बिना आपके किराए के नुकसान के उसे रीलोकेट करती है।",
      legalProtection: "कानूनी सुरक्षा: धारा 105 टीपीए",
      hostProtected: "100% होस्ट सुरक्षित",
      printBtn: "होस्ट नियम प्रमाण पत्र प्रिंट करें",
    },
    familyDashboardSection: {
      badge: "फैमिली को-पायलट एवं सुरक्षा चार्टर",
      title: "दूर रहने वाले",
      titleGradient: "बेटों और बेटियों के लिए",
      subtitle: "यह जानकर पूर्ण मानसिक शांति कि आपके माता-पिता 24×7 सुरक्षित, साथ में और संरक्षित हैं।",
      features: [
        { title: "रिमोट फैमिली डैशबोर्ड", desc: "अपने फोन पर सत्यापित छात्र के चेक-इन और रेटिंग की लाइव निगरानी।" },
        { title: "24/7 त्वरित आपातकालीन प्रतिक्रिया", desc: "तत्काल सहायता के लिए स्थानीय नोडल प्रबंधकों से जुड़ा 1-टच बेडसाइड एसओएस बटन।" },
        { title: "डिजिटल साथी", desc: "छात्र स्मार्टफोन तकनीक, दवाइयां मंगाने और छोटे-मोटे घरेलू कामों में मदद करते हैं।" },
      ],
      sosTitle: "1-टच बेडसाइड इमरजेंसी एसओएस सिम्युलेटर",
      sosSubtitle: "देखें कि जब बुजुर्ग अपने बेडसाइड सुरक्षा बटन को दबाते हैं तो क्या होता है।",
      triggerBtn: "🔴 लाइव एसओएस सिमुलेशन शुरू करें",
      resetBtn: "इमरजेंसी सिम्युलेटर रीसेट करें",
      stages: [
        { label: "चरण 1", title: "तत्काल ऐप एवं बीकन सिग्नल", desc: "बेडसाइड बीकन स्थानीय कानपुर नोडल मैनेजर को लाइव जीपीएस भेजता है (0.4s)।" },
        { label: "चरण 2", title: "छात्र साथी एवं नोडल टीम अलर्ट", desc: "घर में मौजूद सत्यापित छात्र तुरंत अलर्ट होता है; स्थानीय मैनेजर रवाना (1.2s)।" },
        { label: "चरण 3", title: "परिवार WhatsApp पर कनेक्ट", desc: "दिल्ली/बेंगलुरु में बेटे/बेटी को स्वचालित ऑडियो कॉल व लाइव स्थिति मिलती है (2.4s)।" },
      ]
    },
    storiesSection: {
      badge: "सच्चे कानपुर अनुभव",
      title: "छात्रों द्वारा पसंद किया गया।",
      titleGradient: "बुजुर्गों का स्नेह और आशीर्वाद।",
      subtitle: "छात्र मेहमानों, सीनियर होस्ट्स और स्थानीय रसोइयों की सच्ची कहानियां सुनें।",
      filters: [
        { id: "all", label: "सभी" },
        { id: "students", label: "छात्र" },
        { id: "seniors", label: "सीनियर होस्ट्स" },
        { id: "partners", label: "पार्टनर्स" },
      ],
      playAudio: "असली होस्ट की कहानी सुनें",
      playingAudio: "ऑडियो सिमुलेशन बज रहा है...",
    },
    faqSection: {
      badge: "सामान्य प्रश्न",
      title: "हर शंका का स्पष्ट समाधान",
      subtitle: "हम जानते हैं कि विश्वास कमाया जाता है। यहां जानें कि हम हर कठिन परिस्थिति को कैसे संभालते हैं।",
      searchPlaceholder: "प्रश्न खोजें (उदा. सामान की सुरक्षा, जल्दी वापसी, होस्ट भुगतान)...",
      categories: [
        { id: "all", label: "सभी प्रश्न" },
        { id: "storage", label: "📦 छात्र स्टोरेज" },
        { id: "safety", label: "🛡️ सुरक्षा व क्लेम" },
        { id: "host", label: "🏡 सीनियर होस्ट नियम" },
      ],
      noResults: "कोई मेल खाता प्रश्न नहीं मिला। आप हमारे 24×7 कंसीयज से सीधे WhatsApp पर पूछ सकते हैं।",
    },
    footer: {
      title: "एक ऐसा शहर जहां कोई अकेला नहीं आता।",
      subtitle: "अपने शहर की प्राथमिकता सूची में शामिल हों — स्टैश स्पॉट, सत्यापित कमरे और घर की रसोई बैचों में खुलते हैं।",
      student: "छात्र",
      host: "होस्ट",
      name: "पूरा नाम",
      email: "you@college.edu",
      phone: "+91 98xxx xxxxx",
      college: "कॉलेज का नाम",
      locality: "मोहल्ला / क्षेत्र",
      waiver: "मैं सहमत हूं कि संग्रहीत सामान में सार्थी सुरक्षा चार्टर के अनुसार कोई निषिद्ध/खतरनाक वस्तु नहीं है।",
      join: "वेटलिस्ट में शामिल हों",
      submit: "वेटलिस्ट में शामिल हों",
      or: "या",
      continueWithGoogle: "Google से जारी रखें",
      investorCTA: "इन्वेस्टर वन-पेजर",
      campusCaptainCTA: "कैंपस कैप्टन (₹5k+ कमाएं)",
      copyright: "© 2026 StashSaarthi. सर्वाधिकार सुरक्षित. दिखाए गए मूल्य केवल प्रदर्शन के लिए हैं।"
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Ensure fresh page loads always start in English
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = "en";
      try {
        const saved = sessionStorage.getItem("ss-language") as Language;
        if (saved && (saved === "en" || saved === "hi")) {
          setLanguageState(saved);
          document.documentElement.lang = saved;
        } else {
          setLanguageState("en");
          document.documentElement.lang = "en";
        }
      } catch (e) {
        document.documentElement.lang = "en";
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("ss-language", lang);
        document.documentElement.lang = lang;
      } catch (e) {
        // Ignore storage write issues
      }
    }
  };

  const contextValue = useMemo(() => {
    const activeTranslation = translations[language] || translations.en;
    return {
      language,
      setLanguage,
      t: activeTranslation,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

const defaultContextValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: translations.en,
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context || defaultContextValue;
}
