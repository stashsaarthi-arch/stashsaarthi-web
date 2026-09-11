/**
 * StashSaarthi Autonomous System — Slot Lock & Overbooking Prevention Engine
 * 
 * QA Directive (Task 120)
 * Provides atomic concurrency guards and slot locking to prevent overbooking
 * of micro-storage box slots, co-living rooms, and kitchen meal tokens under high load.
 */

export interface SlotLockRecord {
  lockToken: string;
  nodeId: string;
  userId: string;
  acquiredAt: number;
  expiresAt: number;
  status: "locked" | "confirmed" | "released" | "expired";
}

export interface NodeSlotCapacity {
  nodeId: string;
  nodeName: string;
  totalSlots: number;
  bookedSlots: number;
  activeLocks: SlotLockRecord[];
}

const DEFAULT_LOCK_TTL_MS = 5 * 60 * 1000; // 5 minutes lock reservation
const LOCAL_STORAGE_SLOTS_KEY = "ss_node_slot_capacities";

// In-memory atomic state for client / mock node environment
const nodeCapacitiesMap = new Map<string, NodeSlotCapacity>();

// Initialize default node inventory capacity
const DEFAULT_NODES: NodeSlotCapacity[] = [
  {
    nodeId: "NODE-KAKADEO-01",
    nodeName: "Mrs. Sarita Sharma Node (Kakadeo)",
    totalSlots: 10,
    bookedSlots: 9, // Exactly 1 slot left for high-concurrency testing
    activeLocks: [],
  },
  {
    nodeId: "NODE-IITK-GATE1-02",
    nodeName: "Er. Ramesh Verma Node (Nankari)",
    totalSlots: 15,
    bookedSlots: 14, // 1 slot left
    activeLocks: [],
  },
];

function initNodeCapacities() {
  if (nodeCapacitiesMap.size === 0) {
    for (const node of DEFAULT_NODES) {
      nodeCapacitiesMap.set(node.nodeId, { ...node, activeLocks: [] });
    }
  }
}

/**
 * Purges expired slot locks for a node.
 */
function cleanupExpiredLocks(capacity: NodeSlotCapacity, now = Date.now()): void {
  capacity.activeLocks = capacity.activeLocks.filter(
    (lock) => lock.status === "locked" && lock.expiresAt > now
  );
}

/**
 * Gets remaining available slots for a node (Total - Booked - ActiveLocks).
 */
export function getNodeAvailableSlots(nodeId: string): {
  total: number;
  booked: number;
  locked: number;
  available: number;
} {
  initNodeCapacities();
  const capacity = nodeCapacitiesMap.get(nodeId) || {
    nodeId,
    nodeName: "Standard Host Node",
    totalSlots: 10,
    bookedSlots: 0,
    activeLocks: [],
  };

  cleanupExpiredLocks(capacity);

  const locked = capacity.activeLocks.length;
  const available = Math.max(0, capacity.totalSlots - capacity.bookedSlots - locked);

  return {
    total: capacity.totalSlots,
    booked: capacity.bookedSlots,
    locked,
    available,
  };
}

export interface AcquireLockResult {
  success: boolean;
  lockToken?: string;
  reason?: string;
  remainingSlots: number;
}

/**
 * Atomically attempts to acquire a slot lock for a given user & node.
 * Guaranteed zero overbooking even under high concurrency.
 */
export function tryAcquireSlotLock(
  nodeId: string,
  userId: string,
  ttlMs = DEFAULT_LOCK_TTL_MS
): AcquireLockResult {
  initNodeCapacities();
  const capacity = nodeCapacitiesMap.get(nodeId);
  if (!capacity) {
    return {
      success: false,
      reason: "NODE_NOT_FOUND",
      remainingSlots: 0,
    };
  }

  const now = Date.now();
  cleanupExpiredLocks(capacity, now);

  const activeCount = capacity.activeLocks.length;
  const available = capacity.totalSlots - capacity.bookedSlots - activeCount;

  if (available <= 0) {
    return {
      success: false,
      reason: "SLOT_FULL_OVERBOOKING_PREVENTED",
      remainingSlots: 0,
    };
  }

  // Acquire Lock Atomically
  const lockToken = `LOCK-${nodeId}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const lockRecord: SlotLockRecord = {
    lockToken,
    nodeId,
    userId,
    acquiredAt: now,
    expiresAt: now + ttlMs,
    status: "locked",
  };

  capacity.activeLocks.push(lockRecord);

  return {
    success: true,
    lockToken,
    remainingSlots: available - 1,
  };
}

/**
 * Confirms a booking using an acquired lockToken, incrementing bookedSlots count.
 */
export function confirmSlotBookingWithLock(nodeId: string, lockToken: string): boolean {
  initNodeCapacities();
  const capacity = nodeCapacitiesMap.get(nodeId);
  if (!capacity) return false;

  const lockIndex = capacity.activeLocks.findIndex((l) => l.lockToken === lockToken && l.status === "locked");
  if (lockIndex === -1) return false;

  // Convert lock into permanent booking slot
  capacity.activeLocks.splice(lockIndex, 1);
  capacity.bookedSlots += 1;
  return true;
}

/**
 * Releases a slot lock if user cancels or session times out.
 */
export function releaseSlotLock(nodeId: string, lockToken: string): boolean {
  initNodeCapacities();
  const capacity = nodeCapacitiesMap.get(nodeId);
  if (!capacity) return false;

  const lockIndex = capacity.activeLocks.findIndex((l) => l.lockToken === lockToken);
  if (lockIndex === -1) return false;

  capacity.activeLocks.splice(lockIndex, 1);
  return true;
}

/**
 * Resets node capacity for test harness purposes.
 */
export function resetNodeSlotCapacity(nodeId: string, totalSlots: number, bookedSlots: number): void {
  nodeCapacitiesMap.set(nodeId, {
    nodeId,
    nodeName: "Test Node",
    totalSlots,
    bookedSlots,
    activeLocks: [],
  });
}

/**
 * High-concurrency stress test simulation.
 * Simulates `n` parallel asynchronous users attempting to book simultaneously.
 */
export async function simulateConcurrentBookingRequests(
  nodeId: string,
  concurrentUserCount: number
): Promise<{
  totalRequests: number;
  successfulAcquires: number;
  rejectedAcquires: number;
  winnerTokens: string[];
  rejectionReasons: Record<string, number>;
}> {
  const winnerTokens: string[] = [];
  const rejectionReasons: Record<string, number> = {};

  // Create N parallel async promises executing almost simultaneously
  const tasks = Array.from({ length: concurrentUserCount }).map(async (_, idx) => {
    // Add micro jitter to test concurrency interleaving
    await new Promise((res) => setTimeout(res, Math.random() * 5));
    const userId = `STUDENT-USER-SIM-${idx + 1}`;
    return tryAcquireSlotLock(nodeId, userId);
  });

  const results = await Promise.all(tasks);

  let successfulAcquires = 0;
  let rejectedAcquires = 0;

  for (const res of results) {
    if (res.success && res.lockToken) {
      successfulAcquires += 1;
      winnerTokens.push(res.lockToken);
    } else {
      rejectedAcquires += 1;
      const r = res.reason || "UNKNOWN";
      rejectionReasons[r] = (rejectionReasons[r] || 0) + 1;
    }
  }

  return {
    totalRequests: concurrentUserCount,
    successfulAcquires,
    rejectedAcquires,
    winnerTokens,
    rejectionReasons,
  };
}
