/**
 * Stash Wallet & Zero-Fee Trial Token Engine (Task 80)
 * Allows first-time verified students to claim a ₹60 Zero-Fee Trial Token
 * credited directly to their Stash Wallet for 100% zero-fee trial orders.
 */

import { playPop, playClick } from "./audio";
import { toast } from "sonner";
import { checkAndRecordTokenRateLimit } from "./tokenRateLimiter";

export interface TrialTokenRecord {
  tokenId: string;
  amount: number; // Value in INR (e.g., ₹60)
  claimedAt: string;
  expiresAt: string;
  studentPhone: string;
  studentCollege: string;
  isUsed: boolean;
  usedOnBookingId?: string;
  usedAt?: string;
}

export interface StashWalletState {
  balance: number; // Current wallet balance in INR
  isVerifiedStudent: boolean;
  studentCollege: string;
  trialToken?: TrialTokenRecord;
  transactions: {
    id: string;
    type: "TRIAL_CREDIT" | "BOOKING_DEBIT" | "CASHBACK" | "PROMO";
    amount: number;
    description: string;
    timestamp: string;
  }[];
}

const STORAGE_KEY = "ss_stash_wallet";

const DEFAULT_WALLET: StashWalletState = {
  balance: 0,
  isVerifiedStudent: false,
  studentCollege: "",
  transactions: [],
};

/**
 * Gets the active student Stash Wallet state from localStorage
 */
export function getStashWallet(): StashWalletState {
  if (typeof window === "undefined") return DEFAULT_WALLET;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WALLET;
    return JSON.parse(raw) as StashWalletState;
  } catch (err) {
    console.error("Error reading Stash Wallet:", err);
    return DEFAULT_WALLET;
  }
}

/**
 * Persists updated Stash Wallet state
 */
export function saveStashWallet(state: StashWalletState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Emit custom event for UI reactive updates
    window.dispatchEvent(new CustomEvent("stashsaarthi:wallet-updated", { detail: state }));
  } catch (err) {
    console.error("Error saving Stash Wallet:", err);
  }
}

/**
 * Checks if a user is a first-time student who has NOT claimed their Zero-Fee Trial Token
 */
export function canClaimZeroFeeTrialToken(): boolean {
  const wallet = getStashWallet();
  return !wallet.trialToken;
}

/**
 * Claims a ₹60 Zero-Fee Trial Token for first-time students
 */
export function claimZeroFeeTrialToken(
  studentPhone: string,
  studentCollege: string = "Kanpur Campus",
): { success: boolean; wallet: StashWalletState; message: string } {
  const wallet = getStashWallet();

  if (wallet.trialToken) {
    return {
      success: false,
      wallet,
      message: "Trial token already claimed for this account.",
    };
  }

  // Rate Limit Check (Compliance - Task 90)
  const rateLimitCheck = checkAndRecordTokenRateLimit(
    studentPhone || "global_trial_token",
    "trial_token",
  );
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      wallet,
      message: rateLimitCheck.message,
    };
  }

  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days validity

  const trialToken: TrialTokenRecord = {
    tokenId: `ST-TRIAL-${Math.floor(100000 + Math.random() * 900000)}`,
    amount: 60, // ₹60 Zero-Fee Trial Credit
    claimedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    studentPhone: studentPhone || "9876543210",
    studentCollege: studentCollege || "Kanpur Institute",
    isUsed: false,
  };

  const updatedWallet: StashWalletState = {
    ...wallet,
    balance: wallet.balance + 60,
    isVerifiedStudent: true,
    studentCollege: studentCollege || "Kanpur Institute",
    trialToken,
    transactions: [
      {
        id: `tx-${Date.now()}`,
        type: "TRIAL_CREDIT",
        amount: 60,
        description: "⚡ Zero-Fee Trial Token Credited (First-Time Student Verification)",
        timestamp: now.toISOString(),
      },
      ...wallet.transactions,
    ],
  };

  saveStashWallet(updatedWallet);
  playPop();

  return {
    success: true,
    wallet: updatedWallet,
    message: "🎉 ₹60 Zero-Fee Trial Token credited to your Stash Wallet!",
  };
}

/**
 * Applies the Zero-Fee Trial Token balance to a booking/checkout
 */
export function applyTrialTokenToCheckout(amountToPay: number): {
  discountAmount: number;
  remainingTotal: number;
  tokenApplied: boolean;
  tokenId?: string;
} {
  const wallet = getStashWallet();
  if (!wallet.trialToken || wallet.trialToken.isUsed || wallet.balance <= 0) {
    return {
      discountAmount: 0,
      remainingTotal: amountToPay,
      tokenApplied: false,
    };
  }

  const availableCredit = Math.min(wallet.balance, wallet.trialToken.amount);
  const discountAmount = Math.min(amountToPay, availableCredit);
  const remainingTotal = Math.max(0, amountToPay - discountAmount);

  return {
    discountAmount,
    remainingTotal,
    tokenApplied: discountAmount > 0,
    tokenId: wallet.trialToken.tokenId,
  };
}

/**
 * Consumes the trial token upon successful checkout
 */
export function consumeTrialTokenOnBooking(
  bookingId: string,
  amountDeducted: number,
): StashWalletState {
  const wallet = getStashWallet();
  if (!wallet.trialToken || wallet.trialToken.isUsed) return wallet;

  const updatedWallet: StashWalletState = {
    ...wallet,
    balance: Math.max(0, wallet.balance - amountDeducted),
    trialToken: {
      ...wallet.trialToken,
      isUsed: true,
      usedOnBookingId: bookingId,
      usedAt: new Date().toISOString(),
    },
    transactions: [
      {
        id: `tx-deduct-${Date.now()}`,
        type: "BOOKING_DEBIT",
        amount: amountDeducted,
        description: `⚡ Applied Zero-Fee Trial Token to Booking #${bookingId.slice(0, 8)}`,
        timestamp: new Date().toISOString(),
      },
      ...wallet.transactions,
    ],
  };

  saveStashWallet(updatedWallet);
  return updatedWallet;
}
