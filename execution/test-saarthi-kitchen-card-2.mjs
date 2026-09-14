import { SAARTHI_KITCHEN_CARD_TOKENS, getSaarthiKitchenCardTokens } from "../src/lib/designTokens.ts";

console.log("=== Testing Saarthi Kitchen Card 2.0 Design Tokens ===");

console.log("Countdown timer cutoff times:", SAARTHI_KITCHEN_CARD_TOKENS.countdownTimer);
console.log("Macro breakdown labels:", SAARTHI_KITCHEN_CARD_TOKENS.macroBreakdown);
console.log("Chef bio default tag:", SAARTHI_KITCHEN_CARD_TOKENS.chefBioTag);
console.log("Price pill tokens:", SAARTHI_KITCHEN_CARD_TOKENS.pricePill);

const studentTokens = getSaarthiKitchenCardTokens("student");
const hostTokens = getSaarthiKitchenCardTokens("host");

console.log("Student Primary Accent:", studentTokens.primaryAccent);
console.log("Host Primary Accent:", hostTokens.primaryAccent);

if (studentTokens.primaryAccent === "#10B981" && hostTokens.primaryAccent === "#F59E0B") {
  console.log("✅ Saarthi Kitchen Card 2.0 Tokens Verified Successfully!");
} else {
  console.error("❌ Token mismatch verification failed.");
  process.exit(1);
}
