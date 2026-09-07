import {
  TOKEN_LIMIT_CONFIGS,
  checkTokenRateLimit,
  recordTokenRequest,
  checkAndRecordTokenRateLimit,
  resetTokenRateLimit,
} from "../src/lib/tokenRateLimiter.ts";

console.log("🧪 Starting Token Rate Limiter Compliance Test Suite (Task 90)...\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failedCount++;
  }
}

// Reset clean state
const testPhone = "9876543210";
resetTokenRateLimit(testPhone, "sms_token");

// Test 1: First request should be allowed
const firstResult = checkAndRecordTokenRateLimit(testPhone, "sms_token");
assert(firstResult.allowed === true, "First SMS token request is allowed");

// Test 2: Rapid second request should be blocked by 60s cooldown
const secondResult = checkTokenRateLimit(testPhone, "sms_token");
assert(secondResult.allowed === false, "Immediate 2nd SMS token request is blocked by cooldown");
assert(secondResult.remainingSeconds > 0, `Remaining cooldown reported (${secondResult.remainingSeconds}s)`);
assert(secondResult.displayName === "SMS OTP / Token Request", "Correct channel display name reported");

// Test 3: Reset clears rate limit state
resetTokenRateLimit(testPhone, "sms_token");
const postResetResult = checkTokenRateLimit(testPhone, "sms_token");
assert(postResetResult.allowed === true, "Rate limit successfully reset");

// Test 4: Referral Token channel configuration test
const refKey = "wa_referral_student";
resetTokenRateLimit(refKey, "referral_token");

const ref1 = checkAndRecordTokenRateLimit(refKey, "referral_token");
assert(ref1.allowed === true, "First referral token share is allowed");

const ref2 = checkTokenRateLimit(refKey, "referral_token");
assert(ref2.allowed === false, "Immediate second referral token share is rate limited");

resetTokenRateLimit(refKey, "referral_token");

console.log(`\n📊 Test Summary: ${passedCount} Passed, ${failedCount} Failed`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("✨ All Token Rate Limiter compliance checks passed cleanly!\n");
}
