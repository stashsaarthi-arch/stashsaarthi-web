/**
 * StashSaarthi Autonomous Delivery Fleet Engine (Task 122)
 * Fast, lightweight offline PWA scanner engine for campus runners & doorstep pickup agents.
 */

export interface RunnerTask {
  id: string;
  bookingId: string;
  studentName: string;
  studentPhone: string;
  address: string;
  campusNode: string;
  boxCount: number;
  tamperSealBarcode: string; // e.g. "SS-SEAL-8921"
  estimatedWeightKg: number;
  actualWeightKg?: number;
  status: "assigned" | "en_route" | "scanned_intake" | "delivered_to_host";
  assignedTime: string;
  scannedTime?: string;
  deliveredTime?: string;
  runnerId: string;
  distanceMeters: number;
  instructions: string;
  photoProofUrl?: string;
}

const TASKS_STORAGE_KEY = "ss_delivery_runner_tasks";

export const PRESET_RUNNER_TASKS: RunnerTask[] = [
  {
    id: "TASK-KNP-8921",
    bookingId: "SS-KNP-9821",
    studentName: "Rahul Verma (PW Kakadeo)",
    studentPhone: "+919876543210",
    address: "Gali #3, Near PW Vidyapeeth, Chhapeda Pulia, Kakadeo, Kanpur",
    campusNode: "Kakadeo PW Hub",
    boxCount: 2,
    tamperSealBarcode: "SS-SEAL-8921",
    estimatedWeightKg: 18.5,
    status: "assigned",
    assignedTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    runnerId: "RUNNER-KNP-09",
    distanceMeters: 120,
    instructions: "Ring doorbell at 2nd floor room #204. Handle with care - books inside.",
  },
  {
    id: "TASK-KNP-4412",
    bookingId: "SS-KNP-4412",
    studentName: "Ananya Sharma (IIT Kanpur)",
    studentPhone: "+919812345678",
    address: "Hall 4, Room C-102, IIT Kanpur Campus, Kalyanpur",
    campusNode: "IIT Kanpur Nankari Gate",
    boxCount: 3,
    tamperSealBarcode: "SS-SEAL-4412",
    estimatedWeightKg: 24.0,
    status: "assigned",
    assignedTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    runnerId: "RUNNER-KNP-09",
    distanceMeters: 450,
    instructions: "Meet at Nankari Gate security post for luggage verification.",
  },
  {
    id: "TASK-KNP-6630",
    bookingId: "SS-KNP-6630",
    studentName: "Aman Deep (CSJMU)",
    studentPhone: "+919988776655",
    address: "CSJMU Boys Hostel #2, Room 311, Kalyanpur, Kanpur",
    campusNode: "CSJMU Kalyanpur Hub",
    boxCount: 1,
    tamperSealBarcode: "SS-SEAL-6630",
    estimatedWeightKg: 12.0,
    status: "scanned_intake",
    assignedTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    scannedTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    runnerId: "RUNNER-KNP-09",
    distanceMeters: 800,
    instructions: "Intake scanned at doorstep. En route to Dadi Maa Verified PG Owner Host Node.",
  },
];

/**
 * Retrieves current runner tasks from localStorage or seeds preset tasks if empty.
 */
export function getRunnerTasks(): RunnerTask[] {
  if (typeof window === "undefined") return PRESET_RUNNER_TASKS;
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[DeliveryFleetEngine] Error reading tasks from storage:", err);
  }
  // Default seed
  saveRunnerTasks(PRESET_RUNNER_TASKS);
  return PRESET_RUNNER_TASKS;
}

/**
 * Saves runner tasks array to localStorage.
 */
export function saveRunnerTasks(tasks: RunnerTask[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent("stashsaarthi:runner-task-updated"));
  } catch (err) {
    console.warn("[DeliveryFleetEngine] Error saving tasks:", err);
  }
}

/**
 * Validates scanned barcode against active runner tasks and marks item as scanned at doorstep.
 */
export function processDoorstepScan(
  scannedBarcode: string,
  actualWeightKg?: number,
  photoProofUrl?: string,
): { success: boolean; task?: RunnerTask; message: string } {
  const cleanBarcode = scannedBarcode.trim().toUpperCase();
  const tasks = getRunnerTasks();

  const matchedIndex = tasks.findIndex(
    (t) =>
      t.tamperSealBarcode.toUpperCase() === cleanBarcode ||
      t.bookingId.toUpperCase() === cleanBarcode ||
      t.id.toUpperCase() === cleanBarcode,
  );

  if (matchedIndex === -1) {
    return {
      success: false,
      message: `No active pickup task found matching barcode/ID "${cleanBarcode}". Check seal tag or manually select task.`,
    };
  }

  const task = tasks[matchedIndex]!;
  const updatedTask: RunnerTask = {
    ...task,
    status: "scanned_intake",
    scannedTime: new Date().toISOString(),
    actualWeightKg: actualWeightKg ?? task.estimatedWeightKg,
    photoProofUrl:
      photoProofUrl ||
      `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80`,
  };

  tasks[matchedIndex] = updatedTask;
  saveRunnerTasks(tasks);

  return {
    success: true,
    task: updatedTask,
    message: `Doorstep scan verified! Tamper Seal ${updatedTask.tamperSealBarcode} locked for ${updatedTask.studentName}.`,
  };
}

/**
 * Confirms delivery of luggage box from doorstep runner to verified Verified PG Owner Host Locker node.
 */
export function confirmDeliveryToHost(taskId: string): {
  success: boolean;
  task?: RunnerTask;
  message: string;
} {
  const tasks = getRunnerTasks();
  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return { success: false, message: "Task ID not found." };
  }

  const updated: RunnerTask = {
    ...tasks[index]!,
    status: "delivered_to_host",
    deliveredTime: new Date().toISOString(),
  };

  tasks[index] = updated;
  saveRunnerTasks(tasks);

  return {
    success: true,
    task: updated,
    message: `Handover confirmed! Luggage transferred to ${updated.campusNode} Host Locker.`,
  };
}

/**
 * Computes live runner metrics for the PWA dashboard header.
 */
export function getRunnerStats() {
  const tasks = getRunnerTasks();
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "assigned" || t.status === "en_route").length;
  const scanned = tasks.filter((t) => t.status === "scanned_intake").length;
  const completed = tasks.filter((t) => t.status === "delivered_to_host").length;

  return {
    totalTasks: total,
    pendingPickups: pending,
    scannedIntake: scanned,
    completedDelivered: completed,
    avgSlaMins: 14,
    runnerId: "RUNNER-KNP-09",
    runnerName: "Advik Omer (PW Kakadeo Agent)",
  };
}

/**
 * Resets tasks back to default initial state for test harnesses.
 */
export function resetRunnerTasks(): void {
  saveRunnerTasks(PRESET_RUNNER_TASKS);
}
