/**
 * StashSaarthi — Free Campus Doorstep Pickup Threshold Engine (Task 127)
 * Defines unit economics, thresholds, dynamic nudge messaging, and pickup fee calculations.
 */

export const FREE_PICKUP_THRESHOLD_BOXES = 2;
export const STANDARD_PICKUP_FEE = 99;
export const STORAGE_RATE_PER_BOX_MONTH = 300;

export interface FreePickupStatus {
  boxCount: number;
  unlocked: boolean;
  boxesNeeded: number;
  savingsAmount: number;
  pickupFee: number;
  progressPercent: number;
  nudgeMessageEn: string;
  nudgeMessageHi: string;
  unlockedMessageEn: string;
  unlockedMessageHi: string;
  badgeTagEn: string;
  badgeTagHi: string;
}

/**
 * Calculates the free pickup status based on current box quantity.
 */
export function calculateFreePickupStatus(boxCount: number): FreePickupStatus {
  const safeBoxes = Math.max(0, boxCount);
  const unlocked = safeBoxes >= FREE_PICKUP_THRESHOLD_BOXES;
  const boxesNeeded = unlocked ? 0 : FREE_PICKUP_THRESHOLD_BOXES - safeBoxes;
  const progressPercent = Math.min(
    100,
    Math.round((safeBoxes / FREE_PICKUP_THRESHOLD_BOXES) * 100),
  );

  const pickupFee = unlocked ? 0 : STANDARD_PICKUP_FEE;

  const nudgeMessageEn =
    boxesNeeded === 1
      ? "Add 1 more box to unlock 100% Free Campus Doorstep Pickup!"
      : `Add ${boxesNeeded} more boxes to unlock 100% Free Campus Doorstep Pickup!`;

  const nudgeMessageHi =
    boxesNeeded === 1
      ? "100% मुफ़्त कैंपस डोरस्टेप पिकअप अनलॉक करने के लिए 1 और बॉक्स जोड़ें!"
      : `100% मुफ़्त कैंपस डोरस्टेप पिकअप के लिए ${boxesNeeded} और बॉक्स जोड़ें!`;

  const unlockedMessageEn = "🎉 100% Free Campus Doorstep Pickup Unlocked!";
  const unlockedMessageHi = "🎉 100% मुफ़्त कैंपस डोरस्टेप पिकअप अनलॉक हो गया!";

  const badgeTagEn = unlocked ? "FREE DOORSTEP PICKUP" : `SAVE ₹${STANDARD_PICKUP_FEE}`;
  const badgeTagHi = unlocked ? "मुफ़्त डोरस्टेप पिकअप" : `₹${STANDARD_PICKUP_FEE} की बचत`;

  return {
    boxCount: safeBoxes,
    unlocked,
    boxesNeeded,
    savingsAmount: STANDARD_PICKUP_FEE,
    pickupFee,
    progressPercent,
    nudgeMessageEn,
    nudgeMessageHi,
    unlockedMessageEn,
    unlockedMessageHi,
    badgeTagEn,
    badgeTagHi,
  };
}
