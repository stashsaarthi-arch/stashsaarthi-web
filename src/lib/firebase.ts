import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLUfizbJpCLzIBJIjEkhnSkUgI7Vv_AOI",
  authDomain: "stashsaarthi-web.firebaseapp.com",
  projectId: "stashsaarthi-web",
  storageBucket: "stashsaarthi-web.firebasestorage.app",
  messagingSenderId: "923940918736",
  appId: "1:923940918736:web:12eac7b57c133be8b6d5d5",
  measurementId: "G-MJ8SQ3RNTE"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Enforce long-polling to bypass aggressive WebSocket blocking by Ad-blockers
let db: ReturnType<typeof getFirestore>;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });
} catch {
  db = getFirestore(app);
}

let analytics: ReturnType<typeof getAnalytics> | null = null;

// Initialize Analytics safely on client side only in production non-localhost environments
// This completely prevents ad-blockers from triggering net::ERR_BLOCKED_BY_CLIENT during development and local testing
if (
  typeof window !== "undefined" &&
  import.meta.env.PROD &&
  !window.location.hostname.includes("localhost") &&
  !window.location.hostname.includes("127.0.0.1")
) {
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch {
          // Silently handle if blocked by browser tracking protections
        }
      }
    })
    .catch(() => {
      // Silently handle unsupported environments or blocked scripts
    });
}

export { app, auth, db, analytics };
