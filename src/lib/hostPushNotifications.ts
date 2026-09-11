// Host Web Push Notifications Engine & Persistent Audio Alert Synthesizer

export interface HostPushSubscription {
  hostId: string;
  hostName: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  subscribedAt: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface HostBookingNotificationPayload {
  id: string;
  bookingType: "stash" | "spaces" | "kitchen";
  studentName: string;
  studentPhone: string;
  nodeName: string;
  details: string;
  amount: number;
  timestamp: string;
}

const STORAGE_SUB_KEY = "ss_host_push_subscription";
const STORAGE_LOGS_KEY = "ss_host_notification_history";

let alertAudioTimer: ReturnType<typeof setInterval> | null = null;
let alertAudioCtx: AudioContext | null = null;
let isAudioPlaying = false;

/**
 * Web Audio API Persistent Alert Synthesizer
 * Plays an alternating 880Hz / 660Hz dual-tone chime loop until stopped.
 */
export function playPersistentHostBookingAlert(): void {
  if (typeof window === "undefined") return;
  stopPersistentHostBookingAlert();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    alertAudioCtx = new AudioContextClass();
    if (alertAudioCtx.state === "suspended") {
      alertAudioCtx.resume();
    }

    isAudioPlaying = true;
    let toggle = false;

    const playToneStep = () => {
      if (!alertAudioCtx || !isAudioPlaying) return;
      try {
        const osc = alertAudioCtx.createOscillator();
        const gain = alertAudioCtx.createGain();

        osc.connect(gain);
        gain.connect(alertAudioCtx.destination);

        const freq = toggle ? 880 : 660; // High pitch alert dual tone
        toggle = !toggle;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, alertAudioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, alertAudioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, alertAudioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, alertAudioCtx.currentTime + 0.25);

        osc.start(alertAudioCtx.currentTime);
        osc.stop(alertAudioCtx.currentTime + 0.25);
      } catch (err) {
        console.warn("Audio tone step error:", err);
      }
    };

    playToneStep();
    alertAudioTimer = setInterval(playToneStep, 350);
  } catch (err) {
    console.warn("Web Audio alert sound initialization failed:", err);
  }
}

/**
 * Stop persistent alert audio loop
 */
export function stopPersistentHostBookingAlert(): void {
  isAudioPlaying = false;
  if (alertAudioTimer) {
    clearInterval(alertAudioTimer);
    alertAudioTimer = null;
  }
  if (alertAudioCtx) {
    try {
      alertAudioCtx.close();
    } catch {
      // ignore
    }
    alertAudioCtx = null;
  }
}

/**
 * Check if alert sound is actively looping
 */
export function isAlertSoundPlaying(): boolean {
  return isAudioPlaying;
}

/**
 * Get current browser Push Notification permission state
 */
export function getPushPermissionState(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

/**
 * Request Notification permission from host
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Get stored host push subscription
 */
export function getSavedPushSubscription(): HostPushSubscription | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_SUB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Register & save Host Web Push Subscription
 */
export async function subscribeHostToPushNotifications(
  hostId: string = "HOST-KNP-001",
  hostName: string = "Sudha Tripathi Ji"
): Promise<HostPushSubscription> {
  const perm = await requestPushPermission();
  if (perm !== "granted") {
    throw new Error("Notification permission denied by user.");
  }

  // Generate deterministic Web Push mock endpoint keys if native PushManager unavailable
  let endpoint = `https://fcm.googleapis.com/fcm/send/stashsaarthi-host-${hostId}-${Date.now()}`;
  let p256dh = "BIPx37s0K8lA-mockP256dhKey_StashSaarthiHostPush2026";
  let auth = "mockAuthToken_SS2026";

  if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.pushManager) {
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          // VAPID Public Key for StashSaarthi Web Push
          const dummyVapidKey = "BEl62iUYgUivxI-l_88J7g4m_829_P298Z98103-mockVapidKey";
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: dummyVapidKey,
          }).catch(() => null);
        }
        if (sub) {
          endpoint = sub.endpoint;
        }
      }
    } catch {
      // fallback to mock subscription object
    }
  }

  const subscription: HostPushSubscription = {
    hostId,
    hostName,
    endpoint,
    p256dh,
    auth,
    subscribedAt: new Date().toISOString(),
    soundEnabled: true,
    vibrationEnabled: true,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_SUB_KEY, JSON.stringify(subscription));
  }

  return subscription;
}

/**
 * Get notification history log
 */
export function getNotificationHistory(): HostBookingNotificationPayload[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear notification history log
 */
export function clearNotificationHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_LOGS_KEY);
}

/**
 * Trigger incoming booking push notification & persistent alert sound
 */
export async function triggerHostPushNotification(
  payload: HostBookingNotificationPayload
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // 1. Play persistent alert sound
  playPersistentHostBookingAlert();

  // 2. Save notification to audit history log
  const history = getNotificationHistory();
  const updatedHistory = [payload, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updatedHistory));

  // 3. Dispatch window custom event for live UI reactivity
  window.dispatchEvent(
    new CustomEvent("stashsaarthi:host-push-notification", { detail: payload })
  );

  // 4. Trigger Native Browser Web Push Notification
  if ("Notification" in window && Notification.permission === "granted") {
    const title = `🚨 New ${payload.bookingType.toUpperCase()} Booking Request!`;
    const options: any = {
      body: `${payload.studentName} (${payload.studentPhone}) booked ${payload.details} at ${payload.nodeName} for ₹${payload.amount}.`,
      icon: "/app-icon.png",
      badge: "/favicon.png",
      tag: `booking-request-${payload.id}`,
      vibrate: [200, 100, 200, 100, 400],
      requireInteraction: true, // Keep notification persistent until user interacts
      data: {
        bookingId: payload.id,
        url: "/admin",
      },
    };

    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, options);
          return true;
        }
      }
      new Notification(title, options);
      return true;
    } catch (err) {
      console.warn("Failed to trigger native Notification instance:", err);
    }
  }

  return true;
}

/**
 * Helper to generate a realistic incoming booking request payload
 */
export function simulateIncomingBookingRequest(
  overrides?: Partial<HostBookingNotificationPayload>
): HostBookingNotificationPayload {
  const sampleStudents = [
    { name: "Rahul Verma", phone: "+91 98765 43210", node: "Kakadeo Hub (PW Gate 2)" },
    { name: "Ananya Sharma", phone: "+91 91234 56789", node: "IIT Kanpur Nankari Hub" },
    { name: "Vikram Singh", phone: "+91 99887 76655", node: "CSJMU Kalyanpur Hub" },
    { name: "Aditi Rao", phone: "+91 94567 89012", node: "HBTI Nawabganj Hub" },
  ];

  const randomStudent = sampleStudents[Math.floor(Math.random() * sampleStudents.length)] || sampleStudents[0]!;
  const bookingTypes: Array<"stash" | "spaces" | "kitchen"> = ["stash", "spaces", "kitchen"];
  const randomType = overrides?.bookingType || bookingTypes[Math.floor(Math.random() * bookingTypes.length)] || "stash";

  let details = "2x Standard 40L Storage Boxes (1 Month)";
  let amount = 600;

  if (randomType === "spaces") {
    details = "1x Single Bedroom Co-Living Lease";
    amount = 5500;
  } else if (randomType === "kitchen") {
    details = "1x Monthly Standard Thali Pass (60 Meals)";
    amount = 2400;
  }

  return {
    id: `BK-PUSH-${Date.now().toString().slice(-6)}`,
    bookingType: randomType,
    studentName: overrides?.studentName || randomStudent.name,
    studentPhone: overrides?.studentPhone || randomStudent.phone,
    nodeName: overrides?.nodeName || randomStudent.node,
    details: overrides?.details || details,
    amount: overrides?.amount || amount,
    timestamp: new Date().toISOString(),
  };
}
