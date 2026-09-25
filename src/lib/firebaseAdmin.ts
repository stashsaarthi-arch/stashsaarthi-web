import { createRequire } from "node:module";

// Use dynamic require so that Rollup does not hoist the CJS library
// and evaluate it BEFORE our __dirname polyfill in src/polyfill.ts runs.
const require = createRequire(import.meta.url);

// Dummy trace for Vercel NFT to ensure the package is included in the serverless deployment
if (process.env["NEVER_TRUE"]) {
  require("firebase-admin/app");
  require("firebase-admin/auth");
  require("firebase-admin/firestore");
}

export function getAdminAuth() {
  const { getApps, initializeApp, cert } = require("firebase-admin/app");
  const { getAuth } = require("firebase-admin/auth");

  if (!getApps().length) {
    const projectId = process.env["FIREBASE_ADMIN_PROJECT_ID"];
    const clientEmail = process.env["FIREBASE_ADMIN_CLIENT_EMAIL"];
    const privateKey = process.env["FIREBASE_ADMIN_PRIVATE_KEY"]?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("[FirebaseAdmin] Missing environment variables. Admin SDK not initialized.");
      return null;
    }

    try {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    } catch (e) {
      console.error("[FirebaseAdmin] Initialization error:", e);
      return null;
    }
  }
  const app = getApps()[0];
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  const { getApps } = require("firebase-admin/app");
  const { getFirestore } = require("firebase-admin/firestore");

  if (!getApps().length) {
    getAdminAuth();
  }
  const app = getApps()[0];
  return app ? getFirestore(app) : null;
}
