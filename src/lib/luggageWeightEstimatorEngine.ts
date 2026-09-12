export interface LuggageItem {
  id: string;
  name: string;
  nameHi: string;
  category: 'clothing' | 'study' | 'kitchen' | 'misc';
  weightKg: number;
  iconName: string;
}

export interface LuggageCategory {
  id: 'clothing' | 'study' | 'kitchen' | 'misc';
  label: string;
  labelHi: string;
  icon: string;
}

export const LUGGAGE_CATEGORIES: LuggageCategory[] = [
  { id: 'clothing', label: 'Clothes & Bedding', labelHi: 'कपड़े एवं बिस्तर', icon: 'Shirt' },
  { id: 'study', label: 'Books & Tech', labelHi: 'किताबें एवं लैपटॉप', icon: 'BookOpen' },
  { id: 'kitchen', label: 'Kitchen & Utensils', labelHi: 'बर्तन एवं कुकर', icon: 'Utensils' },
  { id: 'misc', label: 'Bucket & Misc', labelHi: 'बाल्टी एवं अन्य सामान', icon: 'Package' },
];

export const LUGGAGE_ITEMS_DATABASE: LuggageItem[] = [
  // Clothing
  { id: 'jeans', name: 'Denim Jeans / Trousers', nameHi: 'जींस / पैंट', category: 'clothing', weightKg: 0.7, iconName: 'Shirt' },
  { id: 'tshirt', name: 'T-Shirts / Shirts', nameHi: 'टी-शर्ट / शर्ट', category: 'clothing', weightKg: 0.25, iconName: 'Shirt' },
  { id: 'hoodie', name: 'Hoodies / Heavy Sweaters', nameHi: 'हुडी / स्वेटर', category: 'clothing', weightKg: 0.65, iconName: 'CloudRain' },
  { id: 'jacket', name: 'Winter Coat / Heavy Jacket', nameHi: 'जैकेट / कोट', category: 'clothing', weightKg: 1.2, iconName: 'Shield' },
  { id: 'shoes', name: 'Shoes / Sneakers (Pair)', nameHi: 'जूते (जोड़ी)', category: 'clothing', weightKg: 0.9, iconName: 'Footprints' },
  { id: 'blanket', name: 'Heavy Blanket / Quilt (Razaai)', nameHi: 'कंबल / रजाई', category: 'clothing', weightKg: 2.8, iconName: 'Bed' },
  { id: 'bedsheet', name: 'Bed Sheet & Pillow', nameHi: 'चादर एवं तकिया', category: 'clothing', weightKg: 1.1, iconName: 'Bed' },

  // Study & Tech
  { id: 'book_heavy', name: 'GATE / JEE Heavy Textbook', nameHi: 'मोटी किताब (JEE/GATE)', category: 'study', weightKg: 1.4, iconName: 'BookOpen' },
  { id: 'notebook', name: 'Class Notebook / Register', nameHi: 'कॉपी / रजिस्टर', category: 'study', weightKg: 0.4, iconName: 'FileText' },
  { id: 'laptop', name: 'Laptop + Charger + Bag', nameHi: 'लैपटॉप + चार्जर', category: 'study', weightKg: 2.4, iconName: 'Laptop' },

  // Kitchen
  { id: 'cooker', name: 'Pressure Cooker / Induction', nameHi: 'प्रेशर कुकर / इंडक्शन', category: 'kitchen', weightKg: 2.7, iconName: 'Utensils' },
  { id: 'utensils', name: 'Utensils Set (Plates/Pans)', nameHi: 'बर्तन सेट (थाली/पतीला)', category: 'kitchen', weightKg: 1.8, iconName: 'Utensils' },

  // Misc
  { id: 'bucket', name: 'Hostel Bucket + Mug', nameHi: 'बाल्टी + मग', category: 'misc', weightKg: 0.7, iconName: 'Box' },
  { id: 'toiletries', name: 'Toiletries & Cosmetics Bag', nameHi: 'टॉयलेटरीज़ एवं किट', category: 'misc', weightKg: 0.85, iconName: 'Sparkles' },
];

export interface ItemQuantityMap {
  [itemId: string]: number;
}

export interface EstimationResult {
  totalWeightKg: number;
  itemCount: number;
  recommendedBoxType: 'STANDARD' | 'JUMBO' | 'MULTI_BOX';
  recommendedBoxCount: number;
  boxTitle: string;
  boxTitleHi: string;
  boxDescription: string;
  boxDescriptionHi: string;
  estimatedPriceMonthly: number;
  deadRentSavingsVsPg: number;
  weightLimitPerBoxKg: number;
  capacityUtilizationPct: number;
}

export interface EstimatorPreset {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  badge: string;
  items: ItemQuantityMap;
}

export const ESTIMATOR_PRESETS: EstimatorPreset[] = [
  {
    id: 'quick_break',
    name: 'Short Break (15-Day Exit)',
    nameHi: 'छोटा ब्रेक (15-दिन एग्जिट)',
    description: 'Light load: 3 Jeans, 5 T-shirts, 4 Books, 1 Pillow',
    descriptionHi: 'हल्का सामान: 3 जींस, 5 टी-शर्ट, 4 किताबें',
    badge: 'Popular for IITK',
    items: { jeans: 3, tshirt: 5, book_heavy: 4, bedsheet: 1 }
  },
  {
    id: 'summer_vacation',
    name: 'Full Summer Break (2 Months)',
    nameHi: 'समर वैकेशन (2 महीने)',
    description: 'Medium load: 6 Jeans, 10 T-shirts, 8 Books, 1 Quilt, 1 Laptop',
    descriptionHi: 'मध्यम सामान: 6 जींस, 10 टी-शर्ट, 8 किताबें, 1 रजाई',
    badge: 'Best Value (1 Jumbo Box)',
    items: { jeans: 6, tshirt: 10, hoodie: 2, blanket: 1, book_heavy: 8, laptop: 1, shoes: 2 }
  },
  {
    id: 'room_shift',
    name: 'Entire PG Room Exit',
    nameHi: 'पूरा पीजी रूम खाली करें',
    description: 'Heavy load: Full clothes wardrobe, books, kitchen & bedding',
    descriptionHi: 'भारी सामान: पूरा कपड़ों का सेट, रजाई, बर्तन, बुक्स',
    badge: '2-Box Multi Pack',
    items: { jeans: 8, tshirt: 14, hoodie: 4, jacket: 2, shoes: 3, blanket: 1, bedsheet: 2, book_heavy: 12, cooker: 1, utensils: 1, bucket: 1 }
  }
];

/**
 * Calculate total luggage weight and box recommendations
 */
export function calculateLuggageEstimate(quantities: ItemQuantityMap): EstimationResult {
  let totalWeight = 0;
  let itemCount = 0;

  LUGGAGE_ITEMS_DATABASE.forEach((item) => {
    const qty = quantities[item.id] || 0;
    if (qty > 0) {
      totalWeight += item.weightKg * qty;
      itemCount += qty;
    }
  });

  // Round weight to 1 decimal place
  totalWeight = Math.round(totalWeight * 10) / 10;

  // Box sizing logic
  let recommendedBoxType: 'STANDARD' | 'JUMBO' | 'MULTI_BOX' = 'STANDARD';
  let recommendedBoxCount = 1;
  let boxTitle = '1x Standard Stash Box (15 kg)';
  let boxTitleHi = '1x स्टैंडर्ड स्टैश बॉक्स (15 किग्रा)';
  let boxDescription = 'Fits up to 15 kg luggage. Ideal for 1-2 week break.';
  let boxDescriptionHi = '15 किग्रा तक का सामान। 1-2 हफ्ते के ब्रेक के लिए आदर्श।';
  let estimatedPriceMonthly = 300;
  let weightLimitPerBoxKg = 15;
  let capacityUtilizationPct = Math.round((totalWeight / 15) * 100);

  if (totalWeight > 25) {
    recommendedBoxType = 'MULTI_BOX';
    recommendedBoxCount = Math.ceil(totalWeight / 20);
    boxTitle = `${recommendedBoxCount}x Stash Boxes Combo`;
    boxTitleHi = `${recommendedBoxCount}x स्टैश बॉक्स कॉम्बो`;
    boxDescription = `High volume luggage (${totalWeight} kg). Divided into ${recommendedBoxCount} sealed tamper-proof boxes.`;
    boxDescriptionHi = `अधिक वजन (${totalWeight} किग्रा)। ${recommendedBoxCount} सीलबंद बॉक्स में विभाजित।`;
    estimatedPriceMonthly = recommendedBoxCount * 300;
    weightLimitPerBoxKg = recommendedBoxCount * 20;
    capacityUtilizationPct = Math.round((totalWeight / (recommendedBoxCount * 20)) * 100);
  } else if (totalWeight > 14.5) {
    recommendedBoxType = 'JUMBO';
    recommendedBoxCount = 1;
    boxTitle = '1x Jumbo Stash Crate (25 kg)';
    boxTitleHi = '1x जंबो स्टैश क्रेट (25 किग्रा)';
    boxDescription = 'Fits up to 25 kg luggage. Perfect for 2-month summer break.';
    boxDescriptionHi = '25 किग्रा तक का सामान। 2 महीने की गर्मियों की छुट्टियों के लिए एकदम सही।';
    estimatedPriceMonthly = 450;
    weightLimitPerBoxKg = 25;
    capacityUtilizationPct = Math.round((totalWeight / 25) * 100);
  }

  // Dead rent savings calculation (Avg Kanpur room rent = ₹6,500/mo)
  const deadRentSavingsVsPg = Math.max(0, 6500 - estimatedPriceMonthly);

  return {
    totalWeightKg: totalWeight,
    itemCount,
    recommendedBoxType,
    recommendedBoxCount,
    boxTitle,
    boxTitleHi,
    boxDescription,
    boxDescriptionHi,
    estimatedPriceMonthly,
    deadRentSavingsVsPg,
    weightLimitPerBoxKg,
    capacityUtilizationPct
  };
}
