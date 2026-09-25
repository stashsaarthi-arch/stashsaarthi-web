export async function getAdminAuth() {
  const { getApps, initializeApp, cert } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");

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

export async function getAdminDb() {
  const { getApps } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  if (!getApps().length) {
    await getAdminAuth();
  }
  const app = getApps()[0];
  return app ? getFirestore(app) : null;
}
