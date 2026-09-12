import {
  generateTokenHash,
  verifyMealTokenSignature,
  getAllSubscriptions,
  mintMealTokenSubscription,
  burnMealToken,
  toggleSubscriptionFreeze,
  getMealTokenStats,
} from "../src/lib/mealTokenLedger.ts";

console.log("🧪 Running Task 132: Cryptographic Meal Token Ledger Verification Suite...");

// 1. Verify Seed Subscriptions
const seedSubs = getAllSubscriptions();
if (!Array.isArray(seedSubs) || seedSubs.length === 0) {
  console.error("❌ Test Failed: Seed subscriptions missing or invalid.");
  process.exit(1);
}
console.log(`✅ Seed subscriptions loaded: ${seedSubs.length} subscription(s) found.`);

// 2. Verify Cryptographic Token Hashing & Signature Verification
const sub0 = seedSubs[0];
const token0 = sub0.tokens[0];
if (!token0) {
  console.error("❌ Test Failed: Token #0 missing.");
  process.exit(1);
}

const isValidSig = verifyMealTokenSignature(token0);
if (!isValidSig) {
  console.error(`❌ Test Failed: Token signature verification failed for ${token0.tokenId}`);
  process.exit(1);
}
console.log(`✅ SHA-256 Token Signature Verified: ${token0.tokenId} -> ${token0.tokenHash}`);

// 3. Mint New Subscription
const testPhone = "9876543210";
const testUser = "Test Student (Kanpur Hub)";
const newSub = mintMealTokenSubscription(testPhone, testUser, "special", "Special Thali Pass", "MONTHLY_30_DAY");

if (!newSub.subscriptionId || newSub.tokens.length !== 30) {
  console.error(`❌ Test Failed: Minting subscription returned invalid token count (${newSub.tokens.length}).`);
  process.exit(1);
}
console.log(`✅ Minted new 30-token subscription: ${newSub.subscriptionId} with 30 micro-tokens.`);

// Verify signatures of newly minted tokens
const newTok1 = newSub.tokens[0];
if (!verifyMealTokenSignature(newTok1)) {
  console.error("❌ Test Failed: Newly minted token signature invalid.");
  process.exit(1);
}
console.log(`✅ Verified signature of newly minted micro-token: ${newTok1.tokenId}`);

// 4. Burn 1 Micro-Token
const burnResult = burnMealToken(newSub.subscriptionId, "annapurna", "Kakadeo Hub - Annapurna Kitchen");
if (!burnResult.success || !burnResult.token || burnResult.token.status !== "BURNED") {
  console.error(`❌ Test Failed: Burning token failed. Message: ${burnResult.message}`);
  process.exit(1);
}
console.log(`✅ Burned 1 Micro-Token: #${burnResult.token.tokenIndex} (${burnResult.token.tokenId}) for daily meal redemption.`);

// 5. Verify Subscription Freeze Toggle
const freezeRes = toggleSubscriptionFreeze(newSub.subscriptionId, true);
if (!freezeRes.success || freezeRes.updatedCount === 0) {
  console.error("❌ Test Failed: Subscription freeze toggle failed.");
  process.exit(1);
}
console.log(`✅ Weekend freeze pause activated: ${freezeRes.updatedCount} token(s) set to FROZEN status.`);

// Unfreeze
const unfreezeRes = toggleSubscriptionFreeze(newSub.subscriptionId, false);
if (!unfreezeRes.success || unfreezeRes.updatedCount === 0) {
  console.error("❌ Test Failed: Subscription unfreeze toggle failed.");
  process.exit(1);
}
console.log(`✅ Subscription unfrozen: ${unfreezeRes.updatedCount} token(s) restored to ACTIVE status.`);

// 6. Verify Ledger Stats
const stats = getMealTokenStats(testPhone);
if (stats.totalSubscriptions < 1 || stats.totalTokensMinted < 30) {
  console.error("❌ Test Failed: Ledger stats calculation incorrect.", stats);
  process.exit(1);
}
console.log(`✅ Meal Token Stats Verified: Total Minted: ${stats.totalTokensMinted}, Active: ${stats.totalActiveTokens}, Burned: ${stats.totalBurnedTokens}, Burn Rate: ${stats.burnRatePercentage}%.`);

console.log("🎉 ALL TASK 132 MEAL TOKEN LEDGER TESTS PASSED SUCCESSFULLY!");
