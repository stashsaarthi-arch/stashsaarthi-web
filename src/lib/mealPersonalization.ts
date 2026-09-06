export interface MealPersonalization {
  id: string;
  name: string;
  nameHi: string;
  priceDelta: number; // Price in INR or Tokens (e.g., 5, 10, 0)
  description: string;
  descriptionHi: string;
  badge?: string;
  badgeHi?: string;
}

export const MEAL_PERSONALIZATION_OPTIONS: MealPersonalization[] = [
  {
    id: "skip_rice_extra_roti",
    name: "Skip Rice, Extra Roti (+2 Roti)",
    nameHi: "चावल न लें, +2 अतिरिक्त रोटी लें",
    priceDelta: 5,
    description: "Replace rice portion with 2 fresh butter phulkas",
    descriptionHi: "चावल के बदले 2 ताज़ा तवा बटर फुल्के प्राप्त करें",
    badge: "🔥 Student Choice",
    badgeHi: "🔥 छात्रों की पहली पसंद",
  },
  {
    id: "extra_ghee",
    name: "Extra Pure Desi Ghee on Phulkas",
    nameHi: "रोटी पर अतिरिक्त शुद्ध देसी घी",
    priceDelta: 5,
    description: "Generous brush of A2 Desi Ghee on all rotis",
    descriptionHi: "सभी रोटियों पर शुद्ध देसी घी की भरपूर कोटिंग",
    badge: "Ghar Jaisa",
    badgeHi: "घर जैसा",
  },
  {
    id: "less_oil_salt",
    name: "Low Oil & Low Salt (Healthy Option)",
    nameHi: "कम तेल और कम नमक (हेल्दी ऑप्शन)",
    priceDelta: 0,
    description: "Lightly seasoned with minimal oil & rock salt",
    descriptionHi: "कम तेल और सेंधा नमक के साथ सुपाच्य भोजन",
    badge: "FREE",
    badgeHi: "मुफ्त",
  },
  {
    id: "extra_paneer_gravy",
    name: "Extra Paneer Gravy Cup (+100ml)",
    nameHi: "अतिरिक्त पनीर ग्रेवी कप (+100ml)",
    priceDelta: 10,
    description: "Extra side bowl of thick cottage cheese gravy",
    descriptionHi: "100 मि.ली. गाढ़ी मसालेदार पनीर ग्रेवी का अतिरिक्त कप",
    badge: "High Protein",
    badgeHi: "हाई प्रोटीन",
  },
  {
    id: "papad_pickle",
    name: "Add Roasted Papad & Mango Pickle",
    nameHi: "भुना पापड़ और आम का अचार",
    priceDelta: 5,
    description: "Crispy roasted urad papad & homestyle mango pickle",
    descriptionHi: "कुरकुरा भुना उड़द पापड़ और घर का बना आम का अचार",
  },
];

/**
 * Calculates total price delta from selected personalization IDs.
 */
export function calculatePersonalizationTotal(selectedIds: string[]): number {
  return selectedIds.reduce((total, id) => {
    const item = MEAL_PERSONALIZATION_OPTIONS.find((opt) => opt.id === id);
    return total + (item ? item.priceDelta : 0);
  }, 0);
}

/**
 * Formats selected personalizations into a readable string for order notes.
 */
export function formatPersonalizationsSummary(selectedIds: string[], isHi = false): string {
  if (selectedIds.length === 0) return isHi ? "कोई कस्टमाइज़ेशन नहीं" : "Standard Prep";
  return selectedIds
    .map((id) => {
      const item = MEAL_PERSONALIZATION_OPTIONS.find((opt) => opt.id === id);
      if (!item) return "";
      const deltaStr = item.priceDelta > 0 ? ` (+₹${item.priceDelta})` : " (Free)";
      return `${isHi ? item.nameHi : item.name}${deltaStr}`;
    })
    .filter(Boolean)
    .join(", ");
}
