/**
 * StashSaarthi Extended Break Upsell Engine
 * 3+ months storage commitment discount logic (15% OFF total storage fee).
 */

export interface ExtendedBreakQuote {
  isEligible: boolean;
  months: number;
  bags: number;
  baseRatePerBag: number;
  originalStashCost: number;
  discountPercent: number;
  discountAmount: number;
  finalStashCost: number;
  savingsMonthlyRate: number;
}

/**
 * Calculates 15% Extended Break discount for 3+ months storage commitments
 */
export function calculateExtendedBreakDiscount(
  bags: number = 1,
  months: number = 1,
  baseRatePerBag: number = 300,
): ExtendedBreakQuote {
  const safeBags = Math.max(1, bags);
  const safeMonths = Math.max(0.5, months);
  const originalStashCost = Math.round(safeBags * safeMonths * baseRatePerBag);

  const isEligible = safeMonths >= 3;
  const discountPercent = isEligible ? 15 : 0;
  const discountAmount = isEligible ? Math.round(originalStashCost * 0.15) : 0;
  const finalStashCost = Math.max(0, originalStashCost - discountAmount);
  const savingsMonthlyRate = Math.round(baseRatePerBag * (discountPercent / 100));

  return {
    isEligible,
    months: safeMonths,
    bags: safeBags,
    baseRatePerBag,
    originalStashCost,
    discountPercent,
    discountAmount,
    finalStashCost,
    savingsMonthlyRate,
  };
}

/**
 * Provides localized copy for the Extended Break upsell banner
 */
export function getExtendedBreakUpsellMessage(language: "en" | "hi" = "en") {
  const isHi = language === "hi";
  return {
    title: isHi
      ? "🌴 एक्सटेंडेड ब्रेक ऑफर: 15% की विशेष छूट!"
      : "🌴 Extended Break Discount: Save 15%!",
    subtitle: isHi
      ? "3 या उससे अधिक महीनों के लिए स्टैश बुक करने पर कुल बिल पर 15% की इंस्टेंट बचत पाएं।"
      : "Book for 3+ months (semester & summer breaks) to unlock 15% OFF total storage fees.",
    upgradeCta: isHi ? "3 महीने चुनें (15% बचत)" : "Select 3 Months (Save 15%)",
    activeBadge: isHi
      ? "🎉 एक्सटेंडेड ब्रेक डिस्काउंट लागू (-15%)"
      : "🎉 Extended Break 15% Discount Applied!",
  };
}
