/**
 * StashSaarthi Hyperlocal Campus Navigation & Back-Alley Entrance Guide Engine
 *
 * Provides verified GPS coordinates, native Google/Apple Maps walking direction URLs,
 * and step-by-step back-alley entrance instructions for Kakadeo, Kalyanpur, and IITK nodes.
 */

export interface GroundStashNode {
  id: string;
  name: string;
  name_hi: string;
  locality: string;
  locality_hi: string;
  pincode: string;
  campusNearby: string;
  campusNearby_hi: string;
  distance: string;
  distance_hi: string;
  walkTime: string;
  walkTime_hi: string;
  lat: number;
  lng: number;
  mainRoadLandmark: string;
  mainRoadLandmark_hi: string;
  backAlleyGuide: string;
  backAlleyGuide_hi: string;
  stepByStepDirections: {
    step: number;
    instruction: string;
    instruction_hi: string;
    landmarkIcon?: string;
  }[];
  contactPhone: string;
  stashCapacity: number;
  rating: number;
}

export const KANPUR_GROUND_NODES: GroundStashNode[] = [
  {
    id: "kakadeo-annapurna-1",
    name: "Kakadeo PW Vidyapeeth Back-Alley Stash Hub",
    name_hi: "काकादेव पीडब्लू विद्यापीठ बैक-गली स्टैश हब",
    locality: "Kakadeo Coaching Belt, Kanpur",
    locality_hi: "काकादेव कोचिंग बेल्ट, कानपुर",
    pincode: "208002",
    campusNearby: "PW Vidyapeeth & Allen Kakadeo",
    campusNearby_hi: "पीडब्लू विद्यापीठ व एलन काकादेव",
    distance: "180m from PW Main Gate",
    distance_hi: "पीडब्लू मेन गेट से 180मी",
    walkTime: "2-min walk",
    walkTime_hi: "2 मिनट पैदल",
    lat: 26.4789,
    lng: 80.3061,
    mainRoadLandmark: "Opposite Sharma Tea Stall, Chhapeda Pulia Main Road",
    mainRoadLandmark_hi: "शर्मा चाय स्टॉल के सामने, छापेड़ा पुलिया मुख्य मार्ग",
    backAlleyGuide:
      "📍 Back-Alley Entrance: Google Maps stops at Chhapeda Pulia main road. Take narrow Gali #3 behind Sharma Tea Stall, walk 40 meters straight. Entrance is at the green double-gate on left with StashSaarthi Seal Board #KNP-892.",
    backAlleyGuide_hi:
      "📍 संकरी गली मार्ग: गूगल मैप्स मुख्य सड़क छापेड़ा पुलिया पर रुकता है। शर्मा चाय स्टॉल के पीछे गली नं. 3 में प्रवेश करें, 40 मीटर सीधे चलें। बाईं ओर हरे रंग के डबल गेट पर सार्थी स्टैश बोर्ड #KNP-892 लगा है।",
    stepByStepDirections: [
      {
        step: 1,
        instruction: "Arrive at Chhapeda Pulia Main Road near Sharma Tea Stall.",
        instruction_hi: "शर्मा चाय स्टॉल के पास छापेड़ा पुलिया मुख्य मार्ग पर पहुँचें।",
      },
      {
        step: 2,
        instruction: "Turn into Gali No. 3 (narrow paved alley behind the tea stall).",
        instruction_hi: "गली नं. 3 (चाय स्टॉल के पीछे संकरी पक्की गली) में मुड़ें।",
      },
      {
        step: 3,
        instruction: "Walk 40m past the yellow electric pole to House #14-B.",
        instruction_hi: "पीले बिजली के खंभे को पार कर 40 मीटर मकान #14-B तक चलें।",
      },
      {
        step: 4,
        instruction:
          "Look for Green Double Gate with 'StashSaarthi Verified Host #KNP-892' Laser QR Badge.",
        instruction_hi:
          "'सार्थी स्टैश वेरीफाइड होस्ट #KNP-892' लेजर क्यूआर बैज वाला हरा डबल गेट देखें।",
      },
    ],
    contactPhone: "+919369454350",
    stashCapacity: 18,
    rating: 4.9,
  },
  {
    id: "iitk-nankari-2",
    name: "IIT Kanpur Nankari Gate 1 Back-Lane Node",
    name_hi: "आईआईटी कानपुर नानकारी गेट 1 बैक-लेन नोड",
    locality: "Nankari Village, IIT Gate 1, Kanpur",
    locality_hi: "नानकारी गाँव, आईआईटी गेट 1, कानपुर",
    pincode: "208016",
    campusNearby: "IIT Kanpur Gate 1 & Hall 13",
    campusNearby_hi: "आईआईटी कानपुर गेट 1 व हॉल 13",
    distance: "300m from Hall 13 Gate",
    distance_hi: "हॉल 13 गेट से 300मी",
    walkTime: "4-min walk",
    walkTime_hi: "4 मिनट पैदल",
    lat: 26.5122,
    lng: 80.2325,
    mainRoadLandmark: "Nankari Handpump & Juice Corner near Gate 1",
    mainRoadLandmark_hi: "गेट 1 के पास नानकारी हैंडपंप व जूस कॉर्नर",
    backAlleyGuide:
      "📍 Campus Back-Gate Navigation: From Gate 1 Nankari side exit, walk past the Handpump, take the left dirt lane behind Saini Grocery. Storage facility is Verified PG Owner Host Residence #NK-42 (2-storey brick house with ramp).",
    backAlleyGuide_hi:
      "📍 कैंपस बैक-गेट नेविगेशन: गेट 1 नानकारी साइड से हैंडपंप के आगे चलें, सैनी किराना के पीछे बाईं ओर मुड़ें। होस्ट निवास #NK-42 (रैंप वाला 2-मंजिला लाल ईंट का मकान) है।",
    stepByStepDirections: [
      {
        step: 1,
        instruction: "Exit IIT Kanpur Gate 1 towards Nankari market side.",
        instruction_hi: "आईआईटी कानपुर गेट 1 से नानकारी बाजार की ओर निकलें।",
      },
      {
        step: 2,
        instruction: "Pass Nankari Handpump and turn left into Saini Lane.",
        instruction_hi: "नानकारी हैंडपंप को पार कर सैनी लेन में बाईं ओर मुड़ें।",
      },
      {
        step: 3,
        instruction: "Walk 60m straight towards Verified PG Owner Host House #NK-42.",
        instruction_hi: "सीधे 60 मीटर सीनियर होस्ट हाउस #NK-42 की ओर चलें।",
      },
    ],
    contactPhone: "+919369454350",
    stashCapacity: 14,
    rating: 4.8,
  },
  {
    id: "csjmu-kalyanpur-3",
    name: "CSJMU Kalyanpur Gate 2 Host Corridor",
    name_hi: "सीएसजेएमयू कल्याणपुर गेट 2 होस्ट कॉरिडोर",
    locality: "Kalyanpur Awas Vikas, Kanpur",
    locality_hi: "कल्याणपुर आवास विकास, कानपुर",
    pincode: "208024",
    campusNearby: "CSJMU Main Campus & Girls Hostel Gate",
    campusNearby_hi: "सीएसजेएमयू मुख्य कैंपस व गर्ल्स हॉस्टल गेट",
    distance: "450m from Gate 2",
    distance_hi: "गेट 2 से 450मी",
    walkTime: "5-min walk",
    walkTime_hi: "5 मिनट पैदल",
    lat: 26.4955,
    lng: 80.2588,
    mainRoadLandmark: "Near Indian Oil Petrol Pump, Kalyanpur GT Road",
    mainRoadLandmark_hi: "इंडियन ऑयल पेट्रोल पंप के पास, कल्याणपुर जीटी रोड",
    backAlleyGuide:
      "📍 Residential Alley Guide: Turn into Awas Vikas Sector-A lane behind Petrol Pump. Take 1st right curve. Look for White Villa with Neem tree and StashPass scan sign.",
    backAlleyGuide_hi:
      "📍 आवासीय गली गाइड: पेट्रोल पंप के पीछे आवास विकास सेक्टर-ए लेन में मुड़ें। पहली दाईं मोड़ लें। नीम के पेड़ वाला सफेद विला देखें।",
    stepByStepDirections: [
      {
        step: 1,
        instruction: "Start from Indian Oil Petrol Pump on Kalyanpur GT Road.",
        instruction_hi: "कल्याणपुर जीटी रोड पर इंडियन ऑयल पेट्रोल पंप से शुरू करें।",
      },
      {
        step: 2,
        instruction: "Enter Sector-A residential lane (beside Medical Store).",
        instruction_hi: "मेडिकल स्टोर के बगल में सेक्टर-ए आवासीय लेन में प्रवेश करें।",
      },
      {
        step: 3,
        instruction: "Reach White Villa #AV-108 near Neem Tree.",
        instruction_hi: "नीम के पेड़ के पास सफेद विला #AV-108 पर पहुँचें।",
      },
    ],
    contactPhone: "+919369454350",
    stashCapacity: 22,
    rating: 4.7,
  },
  {
    id: "hbti-nawabganj-4",
    name: "HBTI Nawabganj West Campus Stash Node",
    name_hi: "एचबीटीआई नवाबगंज वेस्ट कैंपस स्टैश नोड",
    locality: "Nawabganj, Kanpur",
    locality_hi: "नवाबगंज, कानपुर",
    pincode: "208002",
    campusNearby: "HBTI West Campus & Resident Doctor Hostels",
    campusNearby_hi: "एचबीटीआई वेस्ट कैंपस व रेजिडेंट डॉक्टर हॉस्टल",
    distance: "350m from HBTI Gate",
    distance_hi: "एचबीटीआई गेट से 350मी",
    walkTime: "4-min walk",
    walkTime_hi: "4 मिनट पैदल",
    lat: 26.4881,
    lng: 80.3152,
    mainRoadLandmark: "Near Durga Temple, Nawabganj Market",
    mainRoadLandmark_hi: "दुर्गा मंदिर के पास, नवाबगंज बाजार",
    backAlleyGuide:
      "📍 Entrance Guide: Pass Durga Temple main gate, enter Temple lane, house is second on right (Brown Gate #NG-5).",
    backAlleyGuide_hi:
      "📍 प्रवेश गाइड: दुर्गा मंदिर मुख्य द्वार पार करें, मंदिर लेन में प्रवेश करें, दूसरा मकान दाईं ओर (भूरा गेट #NG-5) है।",
    stepByStepDirections: [
      {
        step: 1,
        instruction: "Head to Durga Temple on Nawabganj Market road.",
        instruction_hi: "नवाबगंज बाजार रोड पर दुर्गा मंदिर की ओर बढ़ें।",
      },
      {
        step: 2,
        instruction: "Turn right into temple residential alley.",
        instruction_hi: "मंदिर की आवासीय गली में दाईं ओर मुड़ें।",
      },
      {
        step: 3,
        instruction: "House #NG-5 is 25m on the right.",
        instruction_hi: "मकान #NG-5 दाईं ओर 25 मीटर की दूरी पर है।",
      },
    ],
    contactPhone: "+919369454350",
    stashCapacity: 15,
    rating: 4.8,
  },
];

/**
 * Checks if current platform is an Apple device (iOS / macOS)
 */
export function isAppleDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent || "");
}

/**
 * Generates native Google Maps Walking Directions URL
 */
export function getGoogleMapsDirectionsUrl(node: GroundStashNode): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${node.lat},${node.lng}&travelmode=walking`;
}

/**
 * Generates native Apple Maps Walking Directions URL
 */
export function getAppleMapsDirectionsUrl(node: GroundStashNode): string {
  return `https://maps.apple.com/?daddr=${node.lat},${node.lng}&dirflg=w`;
}

/**
 * Generates WhatsApp Share message with back-alley navigation link
 */
export function getWhatsAppDirectionsShareUrl(node: GroundStashNode, isHi: boolean): string {
  const mapUrl = getGoogleMapsDirectionsUrl(node);
  const text = isHi
    ? `📍 *सार्थी स्टैश नोड दिशा-निर्देश:* ${node.name_hi}\n` +
      `📌 *आस-पास:* ${node.campusNearby_hi} (${node.walkTime_hi})\n` +
      `🔍 *मुख्य लैंडमार्क:* ${node.mainRoadLandmark_hi}\n` +
      `🚪 *बैक-गली गाइड:* ${node.backAlleyGuide_hi}\n` +
      `🗺️ *नेविगेट करें:* ${mapUrl}`
    : `📍 *StashSaarthi Node Directions:* ${node.name}\n` +
      `📌 *Near:* ${node.campusNearby} (${node.walkTime})\n` +
      `🔍 *Main Landmark:* ${node.mainRoadLandmark}\n` +
      `🚪 *Back-Alley Guide:* ${node.backAlleyGuide}\n` +
      `🗺️ *Navigate:* ${mapUrl}`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
